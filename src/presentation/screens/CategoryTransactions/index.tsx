import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {SectionList, View} from 'react-native';
import {Appbar, Headline, Subheading, useTheme} from 'react-native-paper';
import {SummaryHeader, TransactionRow} from '../../components';
import {
  filterTransactionByProps,
  filterTransactions,
  observeTransactions,
  transactionTypeSummary,
} from '../../../database/helpers';
import {Transaction, TransactionTypeEnum} from '../../../database/models';

// Transaction component
let CategoryTransaction: React.FC<{
  navigation: any;
  route: any;
  transactions: Transaction[];
}> = ({route, navigation, transactions}) => {
  const [summary, setSummary] =
    React.useState<{income: number; expense: number}>();
  const [groupedTransactions, setGroupedTransactions] = React.useState<
    Transaction[]
  >([]);
  const {categoryId, categoryName} = route.params;
  const {colors} = useTheme();

  React.useEffect(() => {
    fetchSummary();
    filterTransactionBy({categoryIds: [categoryId]});
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
    await fetchSummary(filterBy);
    const _transactions = await filterTransactions(filter);
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
  }

  function renderHeader() {
    return (
      <Appbar.Header style={{elevation: 0}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={categoryName} color={colors.white} />
      </Appbar.Header>
    );
  }

  function renderSectionList() {
    return (
      <View style={{flex: 1, marginHorizontal: 10}}>
        <SectionList
          sections={groupedTransactions}
          renderItem={({item}: {item: Transaction}) => (
            <TransactionRow
              transaction={item}
              key={`transaction-row-${item.id}`}
              onPress={() =>
                navigation.navigate('TransactionDetail', {
                  transactionId: item.id,
                })
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

  if (groupedTransactions.length <= 0)
    return (
      <>
        {renderHeader()}
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Headline style={{marginBottom: 10}}>No Data Found</Headline>
        </View>
      </>
    );

  return (
    <>
      {renderHeader()}
      <SummaryHeader
        income={+summary?.income!}
        expense={+summary?.expense!}
        balance={+(summary?.income! + summary?.expense!)}
      />
      {renderSectionList()}
    </>
  );
};

CategoryTransaction = withObservables([], () => ({
  transactions: observeTransactions(),
}))(CategoryTransaction);

export {CategoryTransaction};
