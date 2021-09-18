import React from 'react';
import {Text, TextStyle} from 'react-native';
import {COLORS, numberToCurrency} from '../constants';
import {TransactionTypeEnum} from '../database/models';

const TransactionAmountText = ({
  amount,
  currency,
  type,
  style,
}: {
  amount: number | string;
  currency: string;
  type: TransactionTypeEnum;
  style?: TextStyle;
}) => {
  return (
    <Text
      style={{
        color: type == TransactionTypeEnum.expense ? COLORS.red : COLORS.green,
        ...style,
      }}>
      {numberToCurrency(amount, currency)}
    </Text>
  );
};

export {TransactionAmountText};
