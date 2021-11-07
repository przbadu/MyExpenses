import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, Text, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TransactionAmountText} from '.';
import {CategoryProps, TransactionProps, WalletProps} from '../database/models';
import {responsiveWidth} from '../lib';
import {CurrencyContext, CurrencyContextProps} from '../store/context';
import {AppColorPicker} from './AppColorPicker';

let TransactionRow = ({
  transaction,
  category,
  wallet,
  onPress,
}: {
  transaction: TransactionProps;
  category: CategoryProps;
  wallet: WalletProps;
  onPress?: () => void;
}) => {
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);
  const {colors, fonts} = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Surface style={{...styles.container}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppColorPicker
            color={category.color!}
            icon={category.icon}
            size={responsiveWidth(10)}
            containerStyles={{marginBottom: 0}}
          />
          <View style={styles.textContainer}>
            <Text numberOfLines={2} style={{...fonts.medium}}>
              {transaction.notes}
            </Text>
            <Text
              style={{...fonts.medium, fontSize: 11, color: colors.disabled}}>
              {dayjs(transaction.transactionAt).format('MMM DD')} -{' '}
              {transaction.time}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.amountContainer}>
            <TransactionAmountText
              amount={transaction.amount}
              currency={currency}
              type={transaction.transactionType!}
            />
            <Text style={{...fonts.light, textAlign: 'right'}}>
              {wallet.name}
            </Text>
          </View>
          <Icon name="chevron-right" size={16} color={colors.text} />
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
    padding: 8,
  },
  textContainer: {
    marginRight: 20,
    maxWidth: 200,
  },
  amountContainer: {
    paddingRight: 10,
  },
});

TransactionRow = withObservables(['transaction'], ({transaction}) => ({
  transaction,
  category: transaction.category,
  wallet: transaction.wallet,
}))(TransactionRow);

export {TransactionRow};
