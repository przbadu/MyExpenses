import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Divider, Text, useTheme, Subheading, Surface} from 'react-native-paper';
import {numberToCurrency} from '../lib';
import {CurrencyContext} from '../store/context';

const SummaryCard = ({
  income,
  expense,
  balance,
  containerStyles,
  showIncomeExpense = true,
  showNetBalance = true,
}: {
  income?: number;
  expense?: number;
  balance?: number;
  containerStyles?: ViewStyle;
  showIncomeExpense?: boolean;
  showNetBalance?: boolean;
}) => {
  const {currency} = React.useContext(CurrencyContext);
  const {colors} = useTheme();
  const _balance = balance ? balance : income - expense;

  const inlineStyle = showIncomeExpense ? {} : {...styles.row2};
  const textStyle = showIncomeExpense ? {} : {flex: 1, textAlign: 'right'};

  return (
    <Surface style={{...styles.container, ...inlineStyle, ...containerStyles}}>
      {showNetBalance && (
        <>
          <Text>NET BALANCE</Text>
          <Subheading
            style={{
              marginBottom: 10,
              color: _balance > 0 ? colors.success : colors.notification,
              ...textStyle,
            }}>
            {numberToCurrency(_balance || 0, currency)}
          </Subheading>
          <Divider />
        </>
      )}

      {showIncomeExpense && (
        <View style={styles.incomeExpense}>
          <View>
            <Text>INCOME </Text>
            <Text style={{color: colors.success}}>
              {numberToCurrency(income, currency)}
            </Text>
          </View>
          <View>
            <Text>EXPENSE </Text>
            <Text style={{color: colors.notification}}>
              {numberToCurrency(expense, currency)}
            </Text>
          </View>
        </View>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  incomeExpense: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {SummaryCard};
