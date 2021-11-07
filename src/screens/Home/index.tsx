import {JSXElement} from '@babel/types';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import React, {useContext} from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Caption,
  Headline,
  Subheading,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppChip, CategoryRow, SummaryCard} from '../../components';
import {
  categoryWithTransactionInfo,
  lineChartData,
  lineChartFilterProps,
  observeTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {Transaction, TransactionTypeEnum} from '../../database/models';
import {
  hexToRGBA,
  numberToCurrency,
  responsiveHeight,
  responsiveWidth,
} from '../../lib';
import {CurrencyContext} from '../../store/context';
import {AppLineChart} from './AppLineChart';

let Home = ({transactions}: {transactions: Transaction[]}) => {
  const {currency} = useContext(CurrencyContext);
  const {colors, dark, fonts} = useTheme();

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
      setFilter('y');
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

  function renderCard(income: boolean, amount: number) {
    const mainColor = income ? colors.success : '#FF0000';
    const bg = dark ? hexToRGBA(mainColor, 0.2) : hexToRGBA(mainColor, 0.1);
    const fg = dark ? hexToRGBA('#FFFFFF', 0.6) : mainColor;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flex: 1,
          marginRight: 10,
          backgroundColor: bg,
          padding: 20,
          borderRadius: 15,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Icon
            name={income ? 'arrow-down' : 'arrow-up'}
            color={fg}
            size={20}
          />
          <Icon name="cash" color={fg} size={26} />
        </View>
        <View>
          <Text style={{color: fg, ...fonts.medium}}>
            {income ? 'INCOME' : 'EXPENSE'}
          </Text>
          <Text
            style={{
              color: fg,
              ...fonts.medium,
              fontSize: 16,
            }}>
            {numberToCurrency(amount, currency)}
          </Text>
        </View>
      </View>
    );
  }

  function renderListHeaderComponent() {
    return (
      <>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text>YOUR BALANCE</Text>
          <Headline>{numberToCurrency(balance, currency)}</Headline>
          <View style={{flexDirection: 'row', margin: 10}}>
            {renderCard(true, totalIncome)}
            {renderCard(false, totalExpense)}
          </View>
        </View>

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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {renderHeading('Categories')}
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Button
              icon="plus"
              onPress={() => navigation.navigate('AddCategory')}>
              Add Category
            </Button>
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
      <Appbar.Header>
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
