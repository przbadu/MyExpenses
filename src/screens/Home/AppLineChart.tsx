import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import dayjs from 'dayjs';
import React from 'react';
import {View, Dimensions, FlatList} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Caption, Subheading, Surface, Text, useTheme} from 'react-native-paper';
import Svg, {Rect, Text as TextSVG} from 'react-native-svg';

import {CategoryRow, SummaryCard} from '../../components';

import {
  amountSeperator,
  chartConfig,
  getSiSymbol,
  numberToCurrency,
  numToMonthName,
  numToWeekName,
} from '../../constants';
import {
  categoryWithTransactionInfo,
  lineChartData,
  lineChartFilterProps,
  observeTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {TransactionProps, TransactionTypeEnum} from '../../database/models';
import {CurrencyContext} from '../../store/context';

const _AppLineChart = ({
  transactions,
  filter,
}: {
  transactions: TransactionProps[];
  filter: lineChartFilterProps;
}) => {
  const {currency} = React.useContext(CurrencyContext);
  const [balance, setBalance] = React.useState(0);
  const [categories, setCategories] = React.useState<[]>([]);
  const [chartData, setChartData] = React.useState<
    {amount: number; date: string}[]
  >([{date: dayjs().format('MM'), amount: 0}]);
  const {colors, dark} = useTheme();
  const [tooltipPos, setTooltipPos] = React.useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
      fetchChartData();
      fetchSummary();
    }, []),
  );

  const fetchChartData = async () => {
    const data = await lineChartData(filter);
    setChartData(data);
  };

  const fetchSummary = async () => {
    const summary: {
      transaction_type: TransactionTypeEnum;
      sum_amount: number;
    }[] = await transactionTypeSummary();
    const _balance = summary.reduce(
      (sum, tran) =>
        tran.transaction_type == TransactionTypeEnum.expense
          ? sum - tran.sum_amount
          : sum + tran.sum_amount,
      0,
    );
    setBalance(_balance || 0);
  };

  const fetchCategories = async () => {
    const _categories = await categoryWithTransactionInfo();
    setCategories(_categories);
  };

  function renderTooltip(symbol: string) {
    const label = numberToCurrency(tooltipPos.value || 0, currency) + symbol;

    return (
      <View>
        <Svg>
          <Rect
            x={tooltipPos.x - label.length - 35}
            y={tooltipPos.y - 15}
            width={`${label.length * 10}`}
            height="30"
            fill={colors.background}
          />

          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 5}
            fill={colors.text}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle">
            {label}
          </TextSVG>
        </Svg>
      </View>
    );
  }

  function renderLineChart() {
    const maxNumber = Math.max.apply(
      Math,
      chartData.map(d => d.amount),
    );
    const siSymbol = getSiSymbol(maxNumber);
    const data: number[] = chartData.map((d: {amount: number}): number =>
      amountSeperator(+d.amount, maxNumber),
    );

    const labels = chartData.map((d: {date: string}) => {
      if (filter === 'yearly') return numToMonthName(d.date);
      else if (filter === 'monthly') return d.date;
      else if (filter === 'weekly') return numToWeekName(d.date);
      else return d.date;
    });

    return (
      <LineChart
        data={{
          labels: labels,
          datasets: [{data}],
        }}
        width={Dimensions.get('window').width - 20} // from react-native
        height={200}
        // yAxisLabel="$"
        yAxisSuffix={siSymbol}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig(colors, dark)}
        decorator={() => (tooltipPos.visible ? renderTooltip(siSymbol) : null)}
        onDataPointClick={data => {
          let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

          isSamePoint
            ? setTooltipPos(previousState => {
                return {
                  ...previousState,
                  value: data.value,
                  visible: !previousState.visible,
                };
              })
            : setTooltipPos({
                x: data.x,
                value: data.value,
                y: data.y,
                visible: true,
              });
        }}
        withInnerLines={false}
        withHorizontalLines={false}
        withVerticalLines={false}
        bezier
      />
    );
  }

  if (chartData.length) {
    return (
      <>
        <SummaryCard
          balance={balance}
          containerStyles={{marginHorizontal: 10, marginTop: 10}}
          showIncomeExpense={false}
        />
        <Surface style={{marginHorizontal: 10}}>{renderLineChart()}</Surface>

        {/* render categories */}
        <Subheading style={{marginHorizontal: 10, marginTop: 20}}>
          Expenses Categories
        </Subheading>
        <View style={{flex: 1, marginBottom: 80, marginHorizontal: 10}}>
          <FlatList
            data={categories}
            keyExtractor={item => `category-list-${item.id}`}
            renderItem={({item}) => (
              <CategoryRow
                category={item}
                onPress={() =>
                  navigation.navigate('CategoryTransactions', {
                    categoryId: item.id,
                    categoryName: item.name,
                  })
                }
              />
            )}
          />
        </View>
      </>
    );
  } else {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Caption>Add transactions to generate report</Caption>
      </View>
    );
  }
};

const AppLineChart = withObservables([], () => ({
  transactions: observeTransactions(),
}))(_AppLineChart);

export {AppLineChart};
