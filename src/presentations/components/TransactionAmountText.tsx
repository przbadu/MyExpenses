import React from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {numberToCurrency} from '../../helpers';
import {TransactionTypeEnum} from '../../data/models';
import {useCurrency} from '../hooks/useCurrency';

type Props = {
  amount: number;
  type: TransactionTypeEnum;
  style?: TextStyle;
};

const TransactionAmountText = ({amount, type, style}: Props) => {
  const {currency} = useCurrency();
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

export default TransactionAmountText;
