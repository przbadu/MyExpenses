import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import {Card, Appbar, Text} from 'react-native-paper';
import {observeTransactions} from '../database/helpers';
import {TransactionProps} from '../database/models';

interface TransactionsProps {
  transactions: TransactionProps[];
}
const _Transactions: React.FC<TransactionsProps> = ({transactions}) => {
  const renderItem = ({item}: {item: TransactionProps}) => (
    <TouchableOpacity style={styles.container} onPress={() => {}}>
      <View style={styles.textContainer}>
        <Text numberOfLines={2}>{item.notes}</Text>
        <Text style={styles.datetime}>
          {dayjs(item.transactionAt).format('DD MMM YYYY')} {item.time}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text>Rs. {item.amount}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="TRANSACTIONS" />
      </Appbar.Header>

      <Card style={{marginVertical: 10}}>
        <Card.Content>
          <FlatList data={transactions} renderItem={renderItem} />
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    marginRight: 20,
    flexShrink: 1,
    marginVertical: 15,
  },
  amountContainer: {
    paddingRight: 10,
  },
  datetime: {
    fontSize: 12,
  },
});

const enhance = withObservables([], () => ({
  transactions: observeTransactions(),
}));

const Transactions = enhance(_Transactions);

export {Transactions};
