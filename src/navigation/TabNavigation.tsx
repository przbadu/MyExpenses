import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Home, Transactions, Saving, Settings} from '../screens';

const Tab = createBottomTabNavigator();

export const TabNavigation = () => (
  <Tab.Navigator screenOptions={{}}>
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Transactions" component={Transactions} />
    <Tab.Screen name="Saving" component={Saving} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);
