import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Appearance} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';

import {darkTheme, lightTheme} from '../../helpers';
import AppStatusBar from './AppStatusBar';
import {TabNavigation} from './TabNavigation';

import {RootStackParamList} from './types';
import {TransactionListScreen, TransactionAddScreen} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  let appTheme = Appearance.getColorScheme() == 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={appTheme}>
      <NavigationContainer theme={appTheme}>
        <AppStatusBar />

        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Dashboard" component={TabNavigation} />
          <Stack.Screen
            name="AddTransaction"
            component={TransactionAddScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
