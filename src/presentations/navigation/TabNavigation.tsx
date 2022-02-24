import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import {FAB, Portal, useTheme} from 'react-native-paper';

import {TabBarIcon} from '../components';
import {
  TransactionListScreen,
  StatsListScreen,
  SettingsScreen,
} from '../screens';
import AddTransactionFAB from './AddTransactionFAB';
import {RootStackParamList} from './types';

const Tab = createBottomTabNavigator<RootStackParamList>();

export const TabNavigation = () => {
  return (
    <React.Fragment>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {...styles.navigator},
          headerShown: false,
        }}>
        <Tab.Screen
          name="Home"
          component={StatsListScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                label="Stats"
                icon="chart-timeline-variant"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ListTransactions"
          component={TransactionListScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                label="Transactions"
                icon="calendar-month-outline"
                focused={focused}
              />
            ),
          }}
        />

        <Tab.Screen
          name="MainSettings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <TabBarIcon label="Settings" icon="cog" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
      <AddTransactionFAB />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  navigator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 4,
    height: 80,
  },
});
