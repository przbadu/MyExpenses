import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Appbar,
  Card,
  IconButton,
  Subheading,
  Surface,
} from 'react-native-paper';
import {AppChip} from '../../components';
import {AppLineChart} from './AppLineChart';
import {AppPieChart} from './AppPieChart';

const Home = () => {
  const [chartStyle, setChartStyle] = React.useState<'line' | 'pie'>('line');
  const [filter, setFilter] = React.useState<'1d' | '1w' | '1m' | '6m' | '1y'>(
    '1d',
  );

  function renderFilters() {
    return (
      <Card>
        <Card.Content style={{flexDirection: 'row'}}>
          <AppChip selected={filter === '1d'} onPress={() => setFilter('1d')}>
            1D
          </AppChip>
          <AppChip selected={filter === '1w'} onPress={() => setFilter('1w')}>
            1W
          </AppChip>
          <AppChip selected={filter === '1m'} onPress={() => setFilter('1m')}>
            1M
          </AppChip>
          <AppChip selected={filter === '6m'} onPress={() => setFilter('6m')}>
            6M
          </AppChip>
          <AppChip selected={filter === '1y'} onPress={() => setFilter('1y')}>
            1Y
          </AppChip>
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Stats" />
      </Appbar.Header>

      {renderFilters()}

      <Surface style={styles.surface}>
        <Subheading>Categories</Subheading>
        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="chart-timeline-variant"
            onPress={() => setChartStyle('line')}
          />
          <IconButton
            icon="format-list-bulleted"
            onPress={() => setChartStyle('pie')}
          />
        </View>
      </Surface>

      {chartStyle === 'line' ? <AppLineChart /> : <AppPieChart />}
      {/* Line Chart  */}
      {/* Pie chart */}
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
  },
});

export {Home};
