import dayjs from 'dayjs';
import React, {useContext} from 'react';
import {View} from 'react-native';
import {Colors, Headline, Text, Surface, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {hexToRGBA, numberToCurrency} from '../lib';
import {CurrencyContext} from '../store/context';

interface SummaryHeaderProps {
  balance: number;
  income: number;
  expense: number;
  balanceDate?: string;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  balance,
  income,
  expense,
  balanceDate,
}) => {
  const {colors, fonts, dark} = useTheme();
  const {currency} = useContext(CurrencyContext);

  function renderCard(income: boolean, amount: number) {
    const fg = income ? colors.success : colors.notification;

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flex: 1,
          marginRight: 10,
          padding: 10,
        }}>
        <Text>{income ? 'INCOME' : 'EXPENSE'}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={income ? 'arrow-down' : 'arrow-up'}
            color={fg}
            size={20}
            style={{marginRight: 10}}
          />
          <Text
            style={{
              color: fg,
              ...fonts.medium,
              fontSize: 16,
            }}>
            {numberToCurrency(amount, currency)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Surface
        style={{
          backgroundColor: dark
            ? hexToRGBA(colors.onSurface, 0.11)
            : colors.primary,
          alignItems: 'center',
          paddingVertical: 10,
          paddingBottom: 60,
        }}>
        <Text
          style={{
            color: Colors.green400,
          }}>
          Available Balance
        </Text>
        <Headline style={{color: colors.white}}>
          {numberToCurrency(balance, currency)}
        </Headline>
        {balanceDate && (
          <Text style={{color: colors.white}}>
            {dayjs().format('YYYY MMM, DD')}
          </Text>
        )}
      </Surface>

      <Surface
        style={{
          flexDirection: 'row',
          margin: 10,
          marginTop: -40,
          padding: 10,
          borderRadius: 10,
          elevation: 4,
        }}>
        {renderCard(true, income)}
        {renderCard(false, expense)}
      </Surface>
    </>
  );
};

export {SummaryHeader};
