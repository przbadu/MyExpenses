import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Divider, Text, useTheme, Subheading, Surface} from 'react-native-paper';
import {numberToCurrency} from '../constants';

const SummaryCard = ({
  income,
  expense,
  containerStyles,
  showIncomeExpense = true,
  showNetBalance = true,
}: {
  income: number;
  expense: number;
  containerStyles?: ViewStyle;
  showIncomeExpense?: boolean;
  showNetBalance?: boolean;
}) => {
  const {colors} = useTheme();
  const balance = income - expense;

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
              color: balance > 0 ? colors.success : colors.notification,
              ...textStyle,
            }}>
            {numberToCurrency(balance)}
          </Subheading>
          <Divider />
        </>
      )}

      {showIncomeExpense && (
        <View style={styles.incomeExpense}>
          <View>
            <Text>INCOME </Text>
            <Text style={{color: colors.success}}>
              {numberToCurrency(income)}
            </Text>
          </View>
          <View>
            <Text>EXPENSE </Text>
            <Text style={{color: colors.notification}}>
              {numberToCurrency(expense)}
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
