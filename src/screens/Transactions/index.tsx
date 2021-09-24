import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, SectionList} from 'react-native';
import {
  useTheme,
  Card,
  Appbar,
  Text,
  Subheading,
  Headline,
  Button,
  Menu,
} from 'react-native-paper';
import {
  filterTransactionByProps,
  filterTransactions,
  observeCurrentYearTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {TransactionProps, TransactionTypeEnum} from '../../database/models';
import {COLORS} from '../../constants';
import {CurrencyContext, CurrencyContextProps} from '../../store/context';
import {
  AppModal,
  TransactionAmountText,
  TransactionRow,
  AppChip,
} from '../../components';
import TransactionFilters from './TransactionFilters';

// Transaction component
const _Transactions: React.FC<{
  transactions: TransactionProps[];
  navigation: any;
}> = ({transactions, navigation}) => {
  const [summary, setSummary] =
    React.useState<{income: number; expense: number; balance: number}>();
  const [groupedTransactions, setGroupedTransactions] = React.useState<
    TransactionProps[]
  >([]);
  const [selectedFilterChip, setSelectedFilterChip] = React.useState<
    '7days' | '1month' | '6months' | undefined
  >();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  const {navigate} = navigation;
  const {colors} = useTheme();
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);
  const [showFilter, setShowFilter] = React.useState(false);

  React.useEffect(() => {
    fetchSummary();
    transactionGroupedByMonth(transactions);
  }, []);

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
      balance: income + expense,
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
    filter: '7days' | '1month' | '6months',
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
    }

    await fetchSummary({startDate, endDate});
    const _transactions = await filterTransactions({startDate, endDate});
    transactionGroupedByMonth(_transactions);
  };

  // prepare transactions for SectionList, grouped by month
  function transactionGroupedByMonth(trans: TransactionProps[] | any) {
    let result = trans.reduce(
      (groupedTransaction: any, transaction: TransactionProps): object => {
        const month = dayjs(transaction.transactionAt).format('YYYY MMM');
        groupedTransaction[month] = groupedTransaction[month] || [];
        groupedTransaction[month] = [...groupedTransaction[month], transaction];

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
        <Appbar.Content title="TRANSACTIONS" color={COLORS.white} />
        <Appbar.Action
          icon="calendar-blank-outline"
          color={COLORS.white}
          onPress={() => navigate('CalendarTransactions')}
        />

        <Menu
          visible={showMoreMenu}
          onDismiss={() => setShowMoreMenu(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setShowMoreMenu(true)}
              color={COLORS.white}
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

  function renderSummary() {
    return (
      <Card style={{margin: 10}}>
        <Card.Content
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text>Income</Text>
            <Text>Expense</Text>
            <Text>Balance</Text>
          </View>
          <View>
            <TransactionAmountText
              amount={summary?.income || 0}
              currency={currency}
              type={TransactionTypeEnum.income}
              style={{marginBottom: 5}}
            />
            <TransactionAmountText
              amount={summary?.expense || 0}
              currency={currency}
              type={TransactionTypeEnum.expense}
              style={{marginBottom: 5}}
            />
            <TransactionAmountText
              amount={summary?.balance || 0}
              currency={currency}
              type={
                summary?.balance! > 0
                  ? TransactionTypeEnum.income
                  : TransactionTypeEnum.expense
              }
            />
          </View>
        </Card.Content>
      </Card>
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
      <View style={{flex: 1, marginBottom: 100, marginHorizontal: 10}}>
        <SectionList
          sections={groupedTransactions}
          renderItem={({item}: {item: TransactionProps}) => (
            <TransactionRow
              transaction={item}
              key={`transaction-row-${item.id}`}
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
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          marginHorizontal: 10,
          flexDirection: 'row',
        }}>
        <AppChip
          selected={selectedFilterChip === '7days'}
          onPress={() => periodicTransactionFilter('7days')}>
          7 Days
        </AppChip>
        <AppChip
          selected={selectedFilterChip === '1month'}
          onPress={() => periodicTransactionFilter('1month')}>
          1 Month
        </AppChip>
        <AppChip
          selected={selectedFilterChip === '6months'}
          onPress={() => periodicTransactionFilter('6months')}>
          6 Months
        </AppChip>
        <AppChip
          icon="filter"
          onPress={() => {
            setSelectedFilterChip(undefined);
            setShowFilter(true);
          }}>
          Filter
        </AppChip>
      </View>
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
      {renderSummary()}
      {renderSectionList()}
      {renderFilters()}
    </>
  );
};

const enhance = withObservables([], () => ({
  transactions: observeCurrentYearTransactions(),
}));

const Transactions = enhance(_Transactions);

export {Transactions};
