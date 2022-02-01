import React from 'react';
import {Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {Headline, Text, useTheme} from 'react-native-paper';
import {chartConfig} from '../../../lib';

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
    <>
      <Text style={{alignSelf: 'center', marginTop: 10}}>Top 8 categories</Text>
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
    </>
  );
};

export {AppPieChart};
