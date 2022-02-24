import React, {useContext} from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {numberToCurrency} from '../../helpers';
import {TransactionTypeEnum} from '../../data/models';
import {CurrencyContext} from '../contexts';

type Props = {
  amount: number;
  type: TransactionTypeEnum;
  style?: TextStyle;
};

const TransactionAmountText = ({amount, type, style}: Props) => {
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

export default TransactionAmountText;
