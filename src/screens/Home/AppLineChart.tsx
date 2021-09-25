import React from 'react';
import {View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Surface, useTheme} from 'react-native-paper';
import Svg, {Rect, Text as TextSVG} from 'react-native-svg';
import {SummaryCard} from '../../components';
import {chartConfig, numberToCurrency} from '../../constants';

const records = [
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
];

const AppLineChart = () => {
  const {colors, dark} = useTheme();
  const [tooltipPos, setTooltipPos] = React.useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  function renderTooltip() {
    const label = numberToCurrency(tooltipPos.value.toFixed(2)) + 'k';

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

  return (
    <View>
      <SummaryCard
        income={23000}
        expense={12000}
        containerStyles={{marginHorizontal: 10, marginTop: 10}}
        showIncomeExpense={false}
      />
      <Surface style={{marginHorizontal: 10}}>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{data: records}],
          }}
          width={Dimensions.get('window').width - 20} // from react-native
          height={200}
          // yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={chartConfig(colors, dark)}
          decorator={() => (tooltipPos.visible ? renderTooltip() : null)}
          onDataPointClick={data => {
            console.log('data', data);
            let isSamePoint =
              tooltipPos.x === data.x && tooltipPos.y === data.y;

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
      </Surface>
    </View>
  );
};

export {AppLineChart};
