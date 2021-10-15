import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import React from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Caption,
  Subheading,
  Surface,
} from 'react-native-paper';
import {AppChip, CategoryRow, SummaryCard} from '../../components';
import {
  categoryWithTransactionInfo,
  lineChartData,
  lineChartFilterProps,
  observeTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {Transaction, TransactionTypeEnum} from '../../database/models';
import {responsiveHeight} from '../../lib';
import {AppLineChart} from './AppLineChart';

let Home = ({transactions}: {transactions: Transaction[]}) => {
  const [filter, setFilter] = React.useState<lineChartFilterProps>('m');
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [balance, setBalance] = React.useState(0);
  const [categories, setCategories] = React.useState<[]>([]);
  const [incomeChartData, setIncomeChartData] = React.useState<
    {amount: number; date: string}[]
  >([]);
  const [expenseChartData, setExpenseChartData] = React.useState<
    {amount: number; date: string}[]
  >([]);
  const [manualRefresh, setManualRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setFilter('m');
      fetchReports();
    }, []),
  );

  React.useEffect(() => {
    fetchChartData();
  }, [filter]);

  React.useEffect(() => {
    if (manualRefresh) {
      setManualRefresh(false);
      fetchReports();
    }
  }, [manualRefresh]);

  async function fetchReports() {
    setLoading(true);
    await fetchCategories();
    // await fetchChartData();
    await fetchSummary();
    setLoading(false);
  }

  const fetchChartData = async () => {
    setLoading(true);
    const incomeData = await lineChartData(filter, 'Income');
    const expenseData = await lineChartData(filter, 'Expense');
    setIncomeChartData(incomeData);
    setExpenseChartData(expenseData);
    setLoading(false);
  };

  const fetchSummary = async () => {
    const summary: {
      transaction_type: TransactionTypeEnum;
      sum_amount: number;
    }[] = await transactionTypeSummary();
    const _income = summary.reduce(
      (sum, tran) =>
        tran.transaction_type === TransactionTypeEnum.income
          ? sum + tran.sum_amount
          : sum + 0,
      0,
    );
    const _expense = summary.reduce(
      (sum, tran) =>
        tran.transaction_type === TransactionTypeEnum.expense
          ? sum + tran.sum_amount
          : sum + 0,
      0,
    );
    const _balance = summary.reduce(
      (sum, tran) =>
        tran.transaction_type == TransactionTypeEnum.expense
          ? sum - tran.sum_amount
          : sum + tran.sum_amount,
      0,
    );
    setBalance(_balance || 0);
    setTotalIncome(_income);
    setTotalExpense(_expense);
  };

  const fetchCategories = async () => {
    const _categories = await categoryWithTransactionInfo();
    setCategories(_categories);
  };

  function renderHeading(heading: string) {
    return (
      <Subheading style={{marginHorizontal: 10, marginTop: 20}}>
        {heading.toUpperCase()}
      </Subheading>
    );
  }

  function renderFilters() {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <AppChip selected={filter === 'w'} onPress={() => setFilter('w')}>
            This Week
          </AppChip>
          <AppChip selected={filter === 'm'} onPress={() => setFilter('m')}>
            This Month
          </AppChip>
          <AppChip selected={filter === 'q'} onPress={() => setFilter('q')}>
            This Quarter
          </AppChip>
          <AppChip selected={filter === 'y'} onPress={() => setFilter('y')}>
            This Year
          </AppChip>
        </View>
      </ScrollView>
    );
  }

  function renderListHeaderComponent() {
    return (
      <>
        {renderHeading('cash flow (All)')}
        <SummaryCard
          expense={totalExpense}
          income={totalIncome}
          balance={balance}
          containerStyles={{marginHorizontal: 10, marginTop: 10}}
        />

        {renderHeading('Report')}
        <Surface style={{marginHorizontal: 10, marginTop: 10}}>
          {renderFilters()}
          {loading ? (
            <View
              style={{
                height: responsiveHeight(34),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator animating style={{marginBottom: 10}} />
            </View>
          ) : (
            <AppLineChart
              expenseChartData={expenseChartData}
              incomeChartData={incomeChartData}
              filter={filter}
              loading={loading}
            />
          )}
        </Surface>

        {/* render categories */}
        {renderHeading('Categories')}
      </>
    );
  }

  function renderItem(item: any) {
    return (
      <View style={{marginHorizontal: 10}}>
        <CategoryRow
          category={item}
          onPress={() =>
            navigation.navigate('CategoryTransactions', {
              categoryId: item.id,
              categoryName: item.name,
            })
          }
        />
      </View>
    );
  }

  function renderEmptyPlaceholder() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Caption>Add transactions to generate report</Caption>
      </View>
    );
  }

  function renderCharts() {
    return (
      <FlatList
        nestedScrollEnabled
        data={categories}
        keyExtractor={item => `category-list-${item.id}`}
        ListHeaderComponent={renderListHeaderComponent()}
        ListEmptyComponent={renderEmptyPlaceholder}
        renderItem={({item}) => renderItem(item)}
        refreshing={loading}
        onRefresh={() => setManualRefresh(true)}
        style={{marginBottom: 80}}
      />
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="STATS" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      {renderCharts()}
    </>
  );
};

Home = withObservables([], () => ({
  transactions: observeTransactions(),
}))(Home);

export {Home};
