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
} from '../../components';
import TransactionFilters from './TransactionFilters';

// Transaction component
const _Transactions: React.FC<{
  transactions: TransactionProps[];
  navigation: any;
}> = ({transactions, navigation}) => {
  const [summary, setSummary] =
    React.useState<{income: number; expense: number; balance: number}>();
  const [balance, setBalance] = React.useState<number>(0);
  const [groupedTransactions, setGroupedTransactions] = React.useState<
    TransactionProps[]
  >([]);

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

    console.log('income', _income);

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

  // prepare transactions for SectionList, grouped by month
  function transactionGroupedByMonth(trans: TransactionProps[]) {
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
        <Appbar.Action
          icon="filter"
          color={COLORS.white}
          onPress={() => setShowFilter(true)}
        />
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
                balance > 0
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
            <TransactionRow item={item} key={`transaction-row-${item.id}`} />
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

  if (groupedTransactions.length <= 0)
    return (
      <>
        {renderHeader()}
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Headline>No Data Found</Headline>
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
