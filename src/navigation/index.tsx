import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {hexToRGBA} from '../lib';
import {
  CalendarTransactions,
  CategoryTransaction,
  TransactionDetail,
} from '../screens';
import {AddCategory, EditCategory, ListCategories} from '../screens/Categories';
import {AddWallet, EditWallet, ListWallets} from '../screens/Wallets';
import {ThemeContext} from '../store/context/themeContext';
import {TabNavigation} from './TabNavigation';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <>
      <StatusBar
        backgroundColor={
          theme.dark ? hexToRGBA('#000000', 0.84) : theme.colors.primary
        }
      />
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
            <Stack.Screen name="AddCategory" component={AddCategory} />
            <Stack.Screen name="EditCategory" component={EditCategory} />
            <Stack.Screen name="ListCategories" component={ListCategories} />
            <Stack.Screen name="AddWallet" component={AddWallet} />
            <Stack.Screen name="EditWallet" component={EditWallet} />
            <Stack.Screen name="ListWallets" component={ListWallets} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};
