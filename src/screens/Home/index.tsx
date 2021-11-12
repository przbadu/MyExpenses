import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import React, {useContext} from 'react';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Caption,
  Subheading,
  Surface,
  Text,
  ToggleButton,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  AppChip,
  SummaryHeader,
  CategoryRow,
  AppToggleButton,
} from '../../components';
import {
  categoryWithTransactionInfo,
  lineChartData,
  lineChartFilterProps,
  observeTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {Transaction, TransactionTypeEnum} from '../../database/models';
import {hexToRGBA, responsiveHeight, responsiveWidth} from '../../lib';
import {AppLineChart} from './AppLineChart';

let Home = ({transactions}: {transactions: Transaction[]}) => {
  const {colors, dark} = useTheme();

  const [filter, setFilter] = React.useState<lineChartFilterProps>('m');
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [balance, setBalance] = React.useState(0);
  const [chartType, setChartType] = React.useState<'line' | 'pie'>('line');
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
    fetchReports();
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
    const _categories = await categoryWithTransactionInfo(filter);
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppChip selected={filter === 'w'} onPress={() => setFilter('w')}>
            Week
          </AppChip>
          <AppChip selected={filter === 'm'} onPress={() => setFilter('m')}>
            Month
          </AppChip>
          <AppChip selected={filter === 'q'} onPress={() => setFilter('q')}>
            Quarter
          </AppChip>
          <AppChip selected={filter === 'y'} onPress={() => setFilter('y')}>
            Year
          </AppChip>
        </ScrollView>

        <Surface style={{flexDirection: 'row', marginLeft: responsiveWidth(5)}}>
          <AppToggleButton
            icon="chart-timeline-variant"
            onPress={() => setChartType('line')}
            active={chartType == 'line'}
          />
          <AppToggleButton
            icon="chart-arc"
            onPress={() => setChartType('pie')}
            active={chartType == 'pie'}
          />
        </Surface>
      </View>
    );
  }

  function renderListHeaderComponent() {
    return (
      <>
        <SummaryHeader
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />

        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
          }}>
          {renderFilters()}
        </View>
        <Surface style={{marginHorizontal: 10}}>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {renderHeading('Categories')}
          <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCategory')}
              style={{
                flexDirection: 'row',
                backgroundColor: dark
                  ? hexToRGBA(colors.onSurface, 0.2)
                  : hexToRGBA(colors.primary, 0.1),
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginRight: 10,
                alignItems: 'center',
              }}>
              <Icon
                name="plus"
                size={16}
                color={dark ? colors.text : colors.primary}
              />
              <Text style={{color: dark ? colors.text : colors.primary}}>
                Category
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
      <Appbar.Header style={{elevation: 0}}>
        <Appbar.Content title="STATS" />
        <Appbar.Action icon="chart-pie" onPress={() => {}} />
      </Appbar.Header>

      {renderCharts()}
    </>
  );
};

Home = withObservables([], () => ({
  transactions: observeTransactions(),
}))(Home);

export {Home};
