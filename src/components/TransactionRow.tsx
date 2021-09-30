import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, Text, Avatar, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TransactionAmountText} from '.';
import {CategoryProps, TransactionProps, WalletProps} from '../database/models';
import {CurrencyContext, CurrencyContextProps} from '../store/context';

const _TransactionRow = ({
  transaction,
  category,
  wallet,
}: {
  transaction: TransactionProps;
  category: CategoryProps;
  wallet: WalletProps;
}) => {
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);
  const {colors, fonts} = useTheme();

  return (
    <TouchableOpacity onPress={() => {}}>
      <Surface style={{marginBottom: 5, ...styles.container}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              marginRight: 10,
              width: 2,
              backgroundColor: category.color,
              height: 24,
            }}
          />
          <View style={styles.textContainer}>
            {category && (
              <Text
                numberOfLines={2}
                style={{
                  letterSpacing: 1,
                }}>
                {category.name}
              </Text>
            )}
            <Text numberOfLines={2} style={{...fonts.light}}>
              {transaction.notes}
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
            <Text
              style={{...fonts.medium, fontSize: 12, color: colors.disabled}}>
              {dayjs(transaction.transactionAt).format('MMM DD')},{' '}
              {transaction.time}
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
    flexShrink: 1,
  },
  amountContainer: {
    paddingRight: 10,
  },
});

const enhance = withObservables(['transaction'], ({transaction}) => ({
  transaction,
  category: transaction.category,
  wallet: transaction.wallet,
}));
const TransactionRow = enhance(_TransactionRow);
export {TransactionRow};
