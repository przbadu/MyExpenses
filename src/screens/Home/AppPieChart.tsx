import React from 'react';
import {Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {useTheme} from 'react-native-paper';
import {chartConfig} from '../../lib';

const screenWidth = Dimensions.get('window').width;

export interface AppPieChartDataProps {
  name: string;
  total: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const AppPieChart: React.FC<{data: AppPieChartDataProps[]}> = ({data}) => {
  const {colors} = useTheme();

  return (
    <PieChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={{...chartConfig(colors)}}
      accessor={'total'}
      backgroundColor={colors.surface}
      paddingLeft={'0'}
      absolute
    />
  );
};

export {AppPieChart};
