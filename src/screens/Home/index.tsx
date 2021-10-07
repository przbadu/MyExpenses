import React from 'react';
import {ScrollView, View} from 'react-native';
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
      <Surface>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: 10,
          }}
          contentContainerStyle={{
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
        </ScrollView>
      </Surface>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="EXPENSE STATS" />
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

export {Home};
