import React, {useContext} from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {numberToCurrency} from '../lib';
import {TransactionTypeEnum} from '../database/models';
import {CurrencyContext} from '../store/context';

const TransactionAmountText = ({
  amount,
  type,
  style,
}: {
  amount: number | string;
  type: TransactionTypeEnum;
  style?: TextStyle;
}) => {
  const {currency} = useContext(CurrencyContext);
  const {colors} = useTheme();

  return (
    <Text
      style={{
        color:
          type == TransactionTypeEnum.expense
            ? colors.notification
            : type == TransactionTypeEnum.income
            ? colors.success
            : colors.text,
        ...style,
      }}>
      {numberToCurrency(amount, currency)}
    </Text>
  );
};

export {TransactionAmountText};
