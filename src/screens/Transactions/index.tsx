import withObservables from '@nozbe/with-observables';
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
  Surface,
  useTheme,
} from 'react-native-paper';
import {AppChip, AppModal, SummaryCard, TransactionRow} from '../../components';
import {
  filterTransactionByProps,
  filterTransactions,
  observeTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {Transaction, TransactionTypeEnum} from '../../database/models';
import {DefaultDateFormat, numberToCurrency} from '../../lib';
import {CurrencyContext} from '../../store/context';
import TransactionFilters from './TransactionFilters';

// Transaction component
const _Transactions: React.FC<{
  transactions: Transaction[];
  navigation: any;
}> = ({transactions, navigation}) => {
  const [summary, setSummary] =
    React.useState<{income: number; expense: number}>();
  const [ungroupedTransactions, setUngroupedTransactions] = React.useState<
    Transaction[]
  >([]);
  const [groupedTransactions, setGroupedTransactions] = React.useState<
    Transaction[]
  >([]);
  const [selectedFilterChip, setSelectedFilterChip] = React.useState<
    '7days' | '1month' | '6months' | '1year' | 'custom' | undefined
  >('1year');
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const {currency} = React.useContext(CurrencyContext);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('');

  const {navigate} = navigation;
  const {colors} = useTheme();
  const [showFilter, setShowFilter] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchSummary();
      transactionGroupedByMonth(transactions);
    }, [transactions]),
  );

  const fetchSummary = async (
    filterBy: filterTransactionByProps | null = null,
  ) => {
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
    filter: '7days' | '1month' | '6months' | '1year' | 'custom',
  ) => {
    const endDate: Date = new Date();
    let startDate;

    if (filter === '7days') {
      setSelectedFilterChip('7days');
      startDate = new Date(+dayjs().subtract(7, 'days').startOf('day'));
    } else if (filter === '1month') {
      setSelectedFilterChip('1month');
      startDate = new Date(+dayjs().subtract(1, 'month').startOf('day'));
    } else if (filter === '6months') {
      setSelectedFilterChip('6months');
      startDate = new Date(+dayjs().subtract(6, 'months').startOf('day'));
    } else {
      setSelectedFilterChip('1year');
      startDate = new Date(+dayjs().subtract(1, 'year').startOf('day'));
    }

    await fetchSummary({startDate, endDate});
    const _transactions = await filterTransactions({startDate, endDate});
    transactionGroupedByMonth(_transactions);
  };

  // prepare transactions for SectionList, grouped by month
  function transactionGroupedByMonth(trans: Transaction[] | any) {
    let result = trans
      .sort((a: Transaction, b: Transaction) =>
        a.transactionAt! < b.transactionAt! ? 1 : -1,
      )
      .reduce((groupedTransaction: any, transaction: Transaction): object => {
        const month = dayjs(transaction.transactionAt).format('YYYY MMM');
        groupedTransaction[month] = groupedTransaction[month] || [];
        groupedTransaction[month] = [...groupedTransaction[month], transaction];

        return groupedTransaction;
      }, Object.create(null));

    result = Object.keys(result).map(key => ({title: key, data: result[key]}));
    setGroupedTransactions(result);
    setUngroupedTransactions(trans);
  }

  const importCSV = async () => {
    try {
      const file = await selectFileToUpload();
      if (file) {
        const fileContent = await RNFS.readFile(file);
        const json = await CSV().fromString(fileContent);
        console.log('JSON response : ', json);
      } else {
        setAlertContent(`No file selected`);
        setShowAlert(true);
      }
    } catch (error) {
      setAlertContent(`ImportCSV Error : ${error}`);
      setShowAlert(true);
    }
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
    const csvContent = prepareCSV();
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
  };

  function prepareCSV() {
    let csv = `Sn,Id,Date,Time,Amount,Type,Category,Wallet,Notes\n`;
    transactions.map(async (trans, index) => {
      const date = dayjs(trans.transactionAt).format(DefaultDateFormat);
      const amount = numberToCurrency(trans.amount, currency);
      const category = trans.category;
      const wallet = trans.wallet;
      csv += `${index},${trans.id},${date},${trans.time},${amount},${trans.transactionType},${category.name},${wallet.name},${trans.notes}\n`;
    });

    return csv;
  }

  function renderHeader() {
    return (
      <Appbar.Header>
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
            icon="file-delimited-outline"
            title="Export CSV"
          />
          <Menu.Item
            onPress={importCSV}
            icon="file-delimited-outline"
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
          <TransactionFilters onFilter={filterTransactionBy} />
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
        />
      </View>
    );
  }

  function renderFilterHeader() {
    return (
      <Surface
        style={{
          flexDirection: 'row',
          paddingVertical: 5,
          paddingHorizontal: 10,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedFilterChip !== '1year' && (
            <AppChip
              icon="filter-remove"
              onPress={() => {
                periodicTransactionFilter('1year');
              }}
            />
          )}
          <AppChip
            selected={selectedFilterChip === '7days'}
            onPress={() => periodicTransactionFilter('7days')}>
            7D
          </AppChip>
          <AppChip
            selected={selectedFilterChip === '1month'}
            onPress={() => periodicTransactionFilter('1month')}>
            1M
          </AppChip>
          <AppChip
            selected={selectedFilterChip === '6months'}
            onPress={() => periodicTransactionFilter('6months')}>
            6M
          </AppChip>
          <AppChip
            selected={selectedFilterChip === '1year'}
            onPress={() => periodicTransactionFilter('1year')}>
            1Y
          </AppChip>
          <AppChip
            selected={selectedFilterChip === 'custom'}
            icon="filter"
            onPress={() => {
              setSelectedFilterChip('custom');
              setShowFilter(true);
            }}>
            Filter
          </AppChip>
        </ScrollView>
      </Surface>
    );
  }

  if (groupedTransactions.length <= 0)
    return (
      <>
        {renderHeader()}
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Caption>No Data Found</Caption>
          <Button icon="filter" onPress={() => setShowFilter(true)}>
            Update Filter
          </Button>
        </View>
        {renderFilters()}
      </>
    );

  return (
    <>
      {renderHeader()}
      {renderFilterHeader()}
      <SummaryCard
        income={summary?.income || 0}
        expense={summary?.expense || 0}
        containerStyles={{marginHorizontal: 10, marginVertical: 20}}
      />
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

const Transactions = withObservables([], () => ({
  transactions: observeTransactions(),
}))(_Transactions);

export {Transactions};
