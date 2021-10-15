import dayjs from 'dayjs';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from 'react-native-paper';
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

  function prepareChartData(type: 'income' | 'expense', date: number | string) {
    const data = type === 'income' ? incomeChartData : expenseChartData;
    const result = data.find(d => d.date === date);
    return result ? amountSeperator(+result.amount, maxNumber) : 0;
  }

  function getLabelAndValues() {
    let labels = [];
    let incomeData = [];
    let expenseData = [];
    if (filter === 'y') {
      for (var i = 1; i <= 12; i++) {
        labels.push(numToMonthName(i));
        const _date = i < 10 ? `0${i}` : i.toString();
        incomeData.push(prepareChartData('income', _date));
        expenseData.push(prepareChartData('expense', _date));
      }
    } else if (filter === 'w') {
      for (var i = 0; i < 7; i++) {
        labels.push(numToWeekName(i));
        incomeData.push(prepareChartData('income', i.toString()));
        expenseData.push(prepareChartData('expense', i.toString()));
      }
    } else {
      for (var i = 1; i <= +dayjs().endOf('month').format('MM'); i++) {
        labels.push(i);
        const _date = i < 10 ? `0${i}` : i.toString();
        incomeData.push(prepareChartData('income', _date));
        expenseData.push(prepareChartData('expense', _date));
      }
    }

    return {labels, incomeData, expenseData};
  }

  const maxNumber = Math.max.apply(
    Math,
    [...incomeChartData, ...expenseChartData].map(d => d.amount),
  );
  const siSymbol = getSiSymbol(maxNumber);
  let lineChartDataset = [];
  let legends = [];
  const {labels, incomeData, expenseData} = getLabelAndValues();
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
