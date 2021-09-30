import dayjs from 'dayjs';
import React from 'react';
import {View, SectionList} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {
  useTheme,
  Card,
  Appbar,
  Subheading,
  Headline,
  Button,
  Menu,
} from 'react-native-paper';
import {
  filterTransactionByProps,
  filterTransactions,
  observeTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {TransactionProps, TransactionTypeEnum} from '../../database/models';
import {AppModal, TransactionRow, AppChip, SummaryCard} from '../../components';
import TransactionFilters from './TransactionFilters';

// Transaction component
const _Transactions: React.FC<{
  transactions: TransactionProps[];
  navigation: any;
}> = ({transactions, navigation}) => {
  const [summary, setSummary] =
    React.useState<{income: number; expense: number}>();
  const [groupedTransactions, setGroupedTransactions] = React.useState<
    TransactionProps[]
  >([]);
  const [selectedFilterChip, setSelectedFilterChip] = React.useState<
    '7days' | '1month' | '6months' | '1year' | 'custom' | undefined
  >('1year');
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  const {navigate} = navigation;
  const {colors} = useTheme();
  const [showFilter, setShowFilter] = React.useState(false);

  React.useEffect(() => {
    fetchSummary();
    transactionGroupedByMonth(transactions);
  }, [transactions]);

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
  function transactionGroupedByMonth(trans: TransactionProps[] | any) {
    let result = trans
      .sort((a: TransactionProps, b: TransactionProps) =>
        a.transactionAt! < b.transactionAt! ? 1 : -1,
      )
      .reduce(
        (groupedTransaction: any, transaction: TransactionProps): object => {
          const month = dayjs(transaction.transactionAt).format('YYYY MMM');
          groupedTransaction[month] = groupedTransaction[month] || [];
          groupedTransaction[month] = [
            ...groupedTransaction[month],
            transaction,
          ];

          return groupedTransaction;
        },
        Object.create(null),
      );

    result = Object.keys(result).map(key => ({title: key, data: result[key]}));
    setGroupedTransactions(result);
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
            onPress={() => alert('coming soon')}
            icon="file-delimited-outline"
            title="Download CSV"
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
          renderItem={({item}: {item: TransactionProps}) => (
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
      <Card>
        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <AppChip
            selected={selectedFilterChip === '7days'}
            onPress={() => periodicTransactionFilter('7days')}>
            1W
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

          {selectedFilterChip !== '1year' && (
            <AppChip
              icon="filter-remove"
              onPress={() => {
                periodicTransactionFilter('1year');
              }}
            />
          )}
        </Card.Content>
      </Card>
    );
  }

  if (groupedTransactions.length <= 0)
    return (
      <>
        {renderHeader()}
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Headline style={{marginBottom: 10}}>No Data Found</Headline>
          <Button
            mode="outlined"
            icon="filter"
            onPress={() => setShowFilter(true)}>
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
    </>
  );
};

const Transactions = withObservables([], () => ({
  transactions: observeTransactions(),
}))(_Transactions);

export {Transactions};
