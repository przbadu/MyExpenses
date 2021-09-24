import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Card, useTheme, Text} from 'react-native-paper';
import {TransactionAmountText} from '.';
import {CategoryProps, TransactionProps} from '../database/models';
import {CurrencyContext, CurrencyContextProps} from '../store/context';

const _TransactionRow = ({
  transaction,
  category,
}: {
  transaction: TransactionProps;
  category: CategoryProps;
}) => {
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);
  const {colors} = useTheme();

  return (
    <TouchableOpacity onPress={() => {}}>
      <Card style={{marginBottom: 5, elevation: 0}}>
        <Card.Content style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Avatar.Text
              label={dayjs(transaction.transactionAt).format('DD')}
              size={24}
              // Make sure this background will not conflict with foreground color
              style={{marginRight: 5, backgroundColor: transaction.category.color}}
            /> */}
            <View style={styles.textContainer}>
              <Text numberOfLines={2}>{transaction.notes}</Text>
              <Text numberOfLines={2} style={{color: colors.accent}}>
                {category.name}
              </Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <TransactionAmountText
              amount={transaction.amount}
              currency={currency}
              type={transaction.transactionType!}
            />
            <Text style={{...styles.datetime, color: colors.disabled}}>
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
  datetime: {
    fontSize: 12,
  },
});

const enhance = withObservables(['transaction'], ({transaction}) => ({
  transaction,
  category: transaction.category,
}));
const TransactionRow = enhance(_TransactionRow);
export {TransactionRow};
