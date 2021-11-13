import {useFocusEffect} from '@react-navigation/core';
import CSV from 'csvtojson';
import dayjs from 'dayjs';
import React from 'react';
import {ScrollView, SectionList, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Appbar,
  Button,
  Caption,
  Dialog,
  Menu,
  Paragraph,
  Portal,
  Subheading,
  useTheme,
} from 'react-native-paper';
import {
  AppChip,
  AppModal,
  SummaryHeader,
  TransactionRow,
} from '../../components';
import {
  bulkImportTransaction,
  filterTransactionByProps,
  filterTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {Transaction, TransactionTypeEnum} from '../../database/models';
import {DefaultDateFormat, numberToCurrency} from '../../lib';
import {CurrencyContext} from '../../store/context';
import TransactionFilters from './TransactionFilters';
import {useForm} from './useFilterForm';

// Transaction component
let Transactions: React.FC<{
  navigation: any;
}> = ({navigation}) => {
  const [summary, setSummary] =
    React.useState<{income: number; expense: number}>();
  const [groupedTransactions, setGroupedTransactions] = React.useState<
    Transaction[]
  >([]);
  const [selectedFilterChip, setSelectedFilterChip] = React.useState<
    'd' | 'w' | 'm' | 'y' | 'custom'
  >('m');
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const {currency} = React.useContext(CurrencyContext);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const {navigate} = navigation;
  const {colors} = useTheme();
  const [showFilter, setShowFilter] = React.useState(false);
  const useFormProps = useForm();

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, []),
  );

  async function refreshData() {
    setLoading(true);
    await periodicTransactionFilter(selectedFilterChip);
    setLoading(false);
  }

  const fetchSummary = async (
    filterBy: filterTransactionByProps | null = null,
  ) => {
    console.log('filterby', filterBy);
    const res: {transaction_type: TransactionTypeEnum; sum_amount: number}[] =
      await transactionTypeSummary(filterBy);
    const _income = res.filter(
      s => s.transaction_type === TransactionTypeEnum.income,
    );
    const _expense = res.filter(
      s => s.transaction_type === TransactionTypeEnum.expense,
    );

    const income = _income && _income.length > 0 ? _income[0].sum_amount : 0;
    const expense =
      _expense && _expense.length > 0 ? _expense[0].sum_amount : 0;
    setSummary({
      income,
      expense,
    });
  };

  const filterTransactionBy = async (filterBy: filterTransactionByProps) => {
    const filter = filterBy;
    setShowFilter(false);
    await fetchSummary(filterBy);
    const _transactions = await filterTransactions(filter);
    transactionGroupedByMonth(_transactions);
  };

  const periodicTransactionFilter = async (
    filter: 'd' | 'w' | 'm' | 'y' | 'custom',
  ) => {
    const endDate: Date = new Date(+dayjs().endOf('day'));
    let startDate;

    if (filter === 'd') {
      setSelectedFilterChip('d');
      startDate = new Date(+dayjs().startOf('day'));
    } else if (filter === 'w') {
      setSelectedFilterChip('w');
      startDate = new Date(+dayjs().startOf('week'));
    } else if (filter === 'm') {
      setSelectedFilterChip('m');
      startDate = new Date(+dayjs().startOf('month'));
    } else {
      setSelectedFilterChip('y');
      startDate = new Date(+dayjs().startOf('year'));
    }

    await fetchSummary({startDate, endDate});
    let _transactions;
    _transactions = await filterTransactions({startDate, endDate});
    transactionGroupedByMonth(_transactions);
  };

  // prepare transactions for SectionList, grouped by month
  function transactionGroupedByMonth(trans: Transaction[] | any) {
    let result = trans
      .sort((a: Transaction, b: Transaction) =>
        new Date(a.transactionAt) < new Date(b.transactionAt) ? 1 : -1,
      )
      .reduce((groupedTransaction: any, transaction: Transaction): object => {
        const month = dayjs(transaction.transactionAt).format('YYYY MMM');
        groupedTransaction[month] = groupedTransaction[month] || [];
        groupedTransaction[month] = [...groupedTransaction[month], transaction];

        return groupedTransaction;
      }, Object.create(null));

    result = Object.keys(result).map(key => ({title: key, data: result[key]}));
    setGroupedTransactions(result);
  }

  const importCSV = async () => {
    try {
      const file = await selectFileToUpload();
      if (file) {
        const fileContent = await RNFS.readFile(file);
        const json = await CSV().fromString(fileContent);
        await bulkImportTransaction(json);
      } else {
        setAlertContent(`No file selected`);
        setShowAlert(true);
      }
    } catch (error) {
      setAlertContent(`ImportCSV Error : ${error}`);
      setShowAlert(true);
    }
    setShowMoreMenu(false);
  };

  const selectFileToUpload = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      return res.uri;
      // return await RNFS.readFile(file);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setAlertContent(`ImportCSV Canceld by user : ${error}`);
        setShowAlert(true);
      } else {
        setAlertContent(`ImportCSV Unknown error : ${error}`);
        setShowAlert(true);
      }
    }
  };

  const exportCSV = async () => {
    let csvContent = `Id,Date,Time,Amount,Type,Category,Wallet,Notes\n`;

    for await (const trans of transactions) {
      const date = dayjs(trans.transactionAt).format(DefaultDateFormat);
      const amount = numberToCurrency(trans.amount, currency);
      const category = (await trans.wallet).name;
      const wallet = (await trans.category).name;

      csvContent += `${trans.id},${date},${trans.time},${amount},${trans.transactionType},${category},${wallet},${trans.notes}\n`;
    }

    const fileName = `myexpenses-${dayjs().format(
      'YYYY-MM-DD-hh-mm-ss-a',
    )}.csv`;
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      await RNFS.writeFile(path, csvContent);
      await RNFS.moveFile(path, downloadPath);
    } catch (error) {
      setAlertContent(`Error writing CSV data: ${error}`);
      setShowAlert(true);
    }
    setShowMoreMenu(false);
  };

  function renderHeader() {
    return (
      <Appbar.Header style={{elevation: 0}}>
        <Appbar.Content title="TRANSACTIONS" color={colors.white} />
        <Appbar.Action
          icon="calendar-blank-outline"
          color={colors.white}
          onPress={() => navigate('CalendarTransactions')}
        />

        <Menu
          visible={showMoreMenu}
          onDismiss={() => setShowMoreMenu(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setShowMoreMenu(true)}
              color={colors.white}
            />
          }
          style={{marginTop: 30}}>
          <Menu.Item
            onPress={exportCSV}
            icon="database-export"
            title="Export CSV"
          />
          <Menu.Item
            onPress={importCSV}
            icon="database-import"
            title="Import CSV"
          />
        </Menu>
      </Appbar.Header>
    );
  }

  function renderFilters() {
    if (!showFilter) return null;
    return (
      <AppModal
        onClose={() => setShowFilter(false)}
        heading="Filter Transactions"
        visible={showFilter}
        renderContent={() => (
          <TransactionFilters
            onFilter={() => {
              setSelectedFilterChip('custom');
              filterTransactionBy(useFormProps.form);
            }}
            form={useFormProps.form}
            handleFormChange={useFormProps.handleFormChange}
            submitting={useFormProps.submitting}
            setSubmitting={useFormProps.setSubmitting}
            clearFilter={() => {
              useFormProps.clearFilter();
              periodicTransactionFilter('m');
              setShowFilter(false);
            }}
          />
        )}
      />
    );
  }

  function renderSectionList() {
    return (
      <View style={{flex: 1, marginBottom: 80, marginHorizontal: 10}}>
        <SectionList
          sections={groupedTransactions}
          renderItem={({item}: {item: Transaction}) => (
            <TransactionRow
              transaction={item}
              key={`transaction-row-${item.id}`}
              onPress={() =>
                navigate('TransactionDetail', {transactionId: item.id})
              }
            />
          )}
          keyExtractor={(item, index) => String(item.id) + String(index)}
          renderSectionHeader={({section: {title}}) => (
            <Subheading
              key={`year-${title}`}
              style={{marginBottom: 10, color: colors.primary}}>
              {title}
            </Subheading>
          )}
          ListEmptyComponent={renderEmptyResult()}
          refreshing={loading}
          onRefresh={refreshData}
        />
      </View>
    );
  }

  function renderFilterHeader() {
    return (
      <View style={{marginBottom: 10, marginLeft: 10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <AppChip
            surface
            selected={selectedFilterChip === 'custom'}
            icon={selectedFilterChip === 'custom' ? 'filter-remove' : 'filter'}
            onPress={() => {
              setShowFilter(true);
            }}>
            Filter
          </AppChip>
          <AppChip
            surface
            selected={selectedFilterChip === 'd'}
            onPress={() => periodicTransactionFilter('d')}>
            Today
          </AppChip>
          <AppChip
            surface
            selected={selectedFilterChip === 'w'}
            onPress={() => periodicTransactionFilter('w')}>
            Week
          </AppChip>
          <AppChip
            surface
            selected={selectedFilterChip === 'm'}
            onPress={() => periodicTransactionFilter('m')}>
            Month
          </AppChip>
          <AppChip
            surface
            selected={selectedFilterChip === 'y'}
            onPress={() => periodicTransactionFilter('y')}>
            Year
          </AppChip>
        </ScrollView>
      </View>
    );
  }

  function renderEmptyResult() {
    return (
      <View
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
        <Caption>
          No Data Found!! you can try a different filter or add some
          transactions
        </Caption>
      </View>
    );
  }

  return (
    <>
      {renderHeader()}
      <SummaryHeader
        filterable
        income={+summary?.income!}
        expense={+summary?.expense!}
        balance={+(summary?.income! - summary?.expense!)}
      />
      {renderFilterHeader()}
      {renderSectionList()}
      {renderFilters()}

      <Portal>
        <Dialog visible={showAlert} onDismiss={() => setShowAlert(false)}>
          <Dialog.Content>
            <Paragraph>{alertContent}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAlert(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export {Transactions};
