import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TabBarIcon} from '../components';
import {
  AddSaving,
  AddTransaction,
  Home,
  ListSavings,
  Settings,
  Transactions,
} from '../screens';
import {AddCategory, EditCategory, ListCategories} from '../screens/Categories';
import {AddWallet, EditWallet, ListWallets} from '../screens/Wallets';

const Tab = createBottomTabNavigator();
const SettingStack = createNativeStackNavigator();
const SavingStack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Settings">
      <SettingStack.Screen name="Settings" component={Settings} />
      <SettingStack.Screen name="AddCategory" component={AddCategory} />
      <SettingStack.Screen name="EditCategory" component={EditCategory} />
      <SettingStack.Screen name="ListCategories" component={ListCategories} />
      <SettingStack.Screen name="AddWallet" component={AddWallet} />
      <SettingStack.Screen name="EditWallet" component={EditWallet} />
      <SettingStack.Screen name="ListWallets" component={ListWallets} />
    </SettingStack.Navigator>
  );
}

function SavingsStackScreen() {
  return (
    <SavingStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ListSavings">
      <SavingStack.Screen name="AddSaving" component={AddSaving} />
      <SavingStack.Screen name="ListSavings" component={ListSavings} />
    </SavingStack.Navigator>
  );
}

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
        name="AddTransaction"
        component={AddTransaction}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              icon="plus"
              focused={focused}
              iconColor={colors.white}
              containerStyles={{
                width: 62,
                height: 62,
                borderRadius: 62,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
                marginBottom: 60,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Saving"
        component={SavingsStackScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon label="Savings" icon="piggy-bank" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MainSettings"
        component={SettingsStackScreen}
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
