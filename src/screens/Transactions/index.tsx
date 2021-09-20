import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, SectionList} from 'react-native';
import {useTheme, Card, Appbar, Text, Subheading} from 'react-native-paper';
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
  const [summary, setSummary] = React.useState<
    [{sum_amount: number; transaction_type: TransactionTypeEnum}] | undefined
  >();
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

  React.useEffect(() => {
    if (summary) {
      const result = summary.reduce(
        (sum, s) =>
          s.transaction_type == TransactionTypeEnum.income
            ? sum + s.sum_amount
            : sum - s.sum_amount,
        0,
      );
      setBalance(result);
    }
  }, [summary]);

  const fetchSummary = async (
    filterBy: filterTransactionByProps | null = null,
  ) => {
    const res = await transactionTypeSummary(filterBy);
    setSummary(res);
  };

  const filterTransactionBy = async (filterBy: filterTransactionByProps) => {
    setShowFilter(false);
    fetchSummary(filterBy);
    const _transactions = await filterTransactions(filterBy);
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
            {summary &&
              summary.map(s => (
                <Text style={{marginBottom: 5}} key={s.transaction_type}>
                  {s.transaction_type}
                </Text>
              ))}
            <Text>Balance</Text>
          </View>
          <View>
            {summary &&
              summary.map(s => (
                <TransactionAmountText
                  amount={s.sum_amount}
                  currency={currency}
                  type={s.transaction_type}
                  style={{marginBottom: 5}}
                />
              ))}
            <TransactionAmountText
              amount={balance}
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
