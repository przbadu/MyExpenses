import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabNavigation} from './TabNavigation';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={TabNavigation} />
    </Stack.Navigator>
  );
};
