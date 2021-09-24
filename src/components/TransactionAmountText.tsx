import React from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
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
  const {colors} = useTheme();

  return (
    <Text
      style={{
        color:
          type == TransactionTypeEnum.expense
            ? colors.notification
            : colors.success,
        ...style,
      }}>
      {numberToCurrency(amount, currency)}
    </Text>
  );
};

export {TransactionAmountText};
