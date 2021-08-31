import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from 'react-native-paper';

import {Home, AddTransaction, Transactions, Saving, Settings} from '../screens';
import {TabBarIcon} from '../components';

const Tab = createBottomTabNavigator();

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
        name="AddTransaction"
        component={AddTransaction}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              icon="plus"
              focused={focused}
              iconColor={colors.surface}
              containerStyles={{
                width: 62,
                height: 62,
                borderRadius: 64,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
              }}
            />
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
    // borderTopEndRadius: 10,
    // borderTopLeftRadius: 10,
  },
});
