import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Surface, useTheme} from 'react-native-paper';
import Svg, {Rect, Text as TextSVG} from 'react-native-svg';
import {SummaryCard} from '../../components';
import {
  amountSeperator,
  chartConfig,
  getSiSymbol,
  numberToCurrency,
  numToMonthName,
  numToWeekName,
} from '../../constants';
import {lineChartData, observeTransactions} from '../../database/helpers';

const _AppLineChart = ({transactions}: any) => {
  const [filterBy, setFilterBy] = React.useState<'y' | 'm' | 'w'>('y');
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

  React.useEffect(() => {
    fetchChartData();
  }, [transactions]);

  const fetchChartData = async () => {
    const data = await lineChartData();
    setChartData(data);
  };

  function renderTooltip(symbol: string) {
    const label = numberToCurrency(tooltipPos.value) + symbol;

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
    // const average =
    //   chartData.reduce((sum, d) => sum + d.amount, 0) / chartData.length;
    const siSymbol = getSiSymbol(maxNumber);
    const data = chartData.map((d: {amount: number}): number =>
      amountSeperator(+d.amount, maxNumber),
    );
    console.log('avg', maxNumber);
    console.log('data', data);

    const labels = chartData.map((d: {date: string}) =>
      filterBy === 'y'
        ? numToMonthName(d.date)
        : filterBy == 'w'
        ? numToWeekName(d.date)
        : d.date,
    );

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
          console.log('data', data);
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

  return (
    <View>
      <SummaryCard
        income={23000}
        expense={12000}
        containerStyles={{marginHorizontal: 10, marginTop: 10}}
        showIncomeExpense={false}
      />
      <Surface style={{marginHorizontal: 10}}>{renderLineChart()}</Surface>
    </View>
  );
};

const AppLineChart = withObservables([], () => ({
  transactions: observeTransactions(),
}))(_AppLineChart);

export {AppLineChart};
