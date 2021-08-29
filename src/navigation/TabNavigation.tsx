import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {shadow, Text} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Home, Transactions, Saving, Settings} from '../screens';
import TabBarIcon from '../components/TabBarIcon';
import {createIconSet} from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

export const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {...styles.navigator},
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon label="Home" icon="home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon label="Transactions" icon="history" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Saving"
        component={Saving}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon label="Savings" icon="piggy-bank" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon label="Settings" icon="cog" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
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
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
  },
});
