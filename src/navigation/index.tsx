import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  CalendarTransactions,
  CategoryTransaction,
  TransactionDetail,
} from '../screens';
import {ThemeContext} from '../store/context/themeContext';
import {TabNavigation} from './TabNavigation';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Dashboard" component={TabNavigation} />
            <Stack.Screen
              name="CalendarTransactions"
              component={CalendarTransactions}
            />
            <Stack.Screen
              name="CategoryTransactions"
              component={CategoryTransaction}
            />
            <Stack.Screen
              name="TransactionDetail"
              component={TransactionDetail}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};
