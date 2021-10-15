import React from 'react';
import {Dimensions, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import Svg, {Rect, Text as TextSVG} from 'react-native-svg';
import {lineChartFilterProps} from '../../database/helpers';
import {
  amountSeperator,
  chartConfig,
  getSiSymbol,
  numberToCurrency,
  numToMonthName,
  numToWeekName,
  responsiveHeight,
  responsiveWidth,
} from '../../lib';
import {CurrencyContext} from '../../store/context';

const AppLineChart = ({
  incomeChartData,
  expenseChartData,
  filter,
  loading,
}: {
  filter: lineChartFilterProps;
  incomeChartData: {amount: number; date: string}[];
  expenseChartData: {amount: number; date: string}[];
  loading: boolean;
}) => {
  const {currency} = React.useContext(CurrencyContext);
  const {colors} = useTheme();
  const [tooltipPos, setTooltipPos] = React.useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

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

  const maxNumber = Math.max.apply(
    Math,
    incomeChartData.map(d => d.amount),
  );
  const siSymbol = getSiSymbol(maxNumber);
  const incomeData: number[] = incomeChartData.map(
    (d: {amount: number}): number => amountSeperator(+d.amount, maxNumber),
  );
  const expenseData: number[] = expenseChartData.map(
    (d: {amount: number}): number => amountSeperator(+d.amount, maxNumber),
  );

  let labels;
  if (incomeChartData.length) {
    labels = incomeChartData.map((d: {date: string}) => {
      if (filter === 'yearly') return numToMonthName(d.date);
      else if (filter === 'monthly') return d.date;
      else if (filter === 'weekly') return numToWeekName(d.date);
      else return d.date;
    });
  } else {
    labels = expenseChartData.map((d: {date: string}) => {
      if (filter === 'yearly') return numToMonthName(d.date);
      else if (filter === 'monthly') return d.date;
      else if (filter === 'weekly') return numToWeekName(d.date);
      else return d.date;
    });
  }

  let lineChartDataset = [];
  let legends = [];
  if (incomeData.length) {
    legends.push('Income');
    lineChartDataset.push({
      data: incomeData,
      color: () => colors.success,
    });
  }
  if (expenseData.length) {
    legends.push('Expense');
    lineChartDataset.push({
      data: expenseData,
      color: () => colors.notification,
    });
  }

  return (
    <LineChart
      data={{
        labels: labels,
        datasets: lineChartDataset,
        legend: legends,
      }}
      width={Dimensions.get('window').width - responsiveWidth(5)} // from react-native
      height={responsiveHeight(30)}
      // yAxisLabel="$"
      yAxisSuffix={siSymbol}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={chartConfig(colors)}
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
};

export {AppLineChart};
