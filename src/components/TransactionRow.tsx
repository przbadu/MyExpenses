import dayjs from 'dayjs';
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Card, useTheme, Text, Avatar} from 'react-native-paper';
import {TransactionAmountText} from '.';
import {CategoryProps, TransactionProps} from '../database/models';
import {CurrencyContext, CurrencyContextProps} from '../store/context';

const TransactionRow = ({item}: {item: TransactionProps}) => {
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);
  const {colors} = useTheme();

  return (
    <TouchableOpacity onPress={() => {}}>
      <Card style={{marginBottom: 5, elevation: 0}}>
        <Card.Content style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Avatar.Text
              label={dayjs(item.transactionAt).format('DD')}
              size={24}
              // Make sure this background will not conflict with foreground color
              style={{marginRight: 5, backgroundColor: item.category.color}}
            /> */}
            <View style={styles.textContainer}>
              <Text numberOfLines={2}>{item.notes}</Text>
              <Text style={{...styles.datetime, color: colors.disabled}}>
                {dayjs(item.transactionAt).format('MMM DD')}, {item.time}
              </Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <TransactionAmountText
              amount={item.amount}
              currency={currency}
              type={item.transactionType!}
            />
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

export {TransactionRow};
