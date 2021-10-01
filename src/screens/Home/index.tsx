import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, Card, IconButton, Surface} from 'react-native-paper';
import {AppChip} from '../../components';
import {lineChartFilterProps} from '../../database/helpers';
import {AppLineChart} from './AppLineChart';
import {AppPieChart} from './AppPieChart';

const Home = () => {
  const [chartStyle, setChartStyle] = React.useState<'line' | 'pie'>('line');
  const [filter, setFilter] = React.useState<lineChartFilterProps>('yearly');

  function renderFilters() {
    return (
      <Card>
        <Card.Content
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <AppChip
              selected={filter === 'weekly'}
              onPress={() => setFilter('weekly')}>
              Weekly
            </AppChip>
            <AppChip
              selected={filter === 'monthly'}
              onPress={() => setFilter('monthly')}>
              Monthly
            </AppChip>
            <AppChip
              selected={filter === 'yearly'}
              onPress={() => setFilter('yearly')}>
              Yearly
            </AppChip>
          </View>

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
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      {renderFilters()}

      {chartStyle === 'line' ? (
        <AppLineChart filter={filter} />
      ) : (
        <AppPieChart />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
  },
});

export {Home};
