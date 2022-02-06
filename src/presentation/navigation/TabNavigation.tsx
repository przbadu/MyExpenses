import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TabBarIcon} from '../components';
import {AddTransaction, Home, Settings, Transactions} from '../screens';
import {RootStackParamList} from './types';

const Tab = createBottomTabNavigator<RootStackParamList>();

export const TabNavigation = () => {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {...styles.navigator},
        headerShown: false,
      }}>
      <Tab.Screen
        name="AddTransaction"
        component={AddTransaction}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              icon="plus"
              focused={focused}
              iconColor={colors.white}
              containerStyles={{
                width: 48,
                height: 48,
                borderRadius: 62,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
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
        name="Transactions"
        component={Transactions}
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
  },
});
