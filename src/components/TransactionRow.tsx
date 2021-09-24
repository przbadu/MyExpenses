import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Card, useTheme, Text, Avatar} from 'react-native-paper';
import {TransactionAmountText} from '.';
import {COLORS} from '../constants';
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
      <Card style={{marginBottom: 5, elevation: 0}}>
        <Card.Content style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Avatar.Text
              label=""
              size={16}
              style={{marginRight: 5, backgroundColor: category.color}}
            /> */}
            <View
              style={{
                marginRight: 10,
                width: 2,
                backgroundColor: category.color,
                height: 24,
              }}
            />
            <View style={styles.textContainer}>
              <Text
                numberOfLines={2}
                style={{
                  color: colors.accent,
                  ...fonts.medium,
                  letterSpacing: 1,
                }}>
                {category.name}
              </Text>
              <Text numberOfLines={2} style={{...fonts.light}}>
                {transaction.notes}
              </Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <TransactionAmountText
              amount={transaction.amount}
              currency={currency}
              type={transaction.transactionType!}
            />
            <Text
              style={{...fonts.light, fontSize: 12, color: colors.disabled}}>
              {dayjs(transaction.transactionAt).format('MMM DD')},{' '}
              {transaction.time}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
