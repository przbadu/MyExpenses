import withObservables from '@nozbe/with-observables';
import currency from 'currency.js';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, SectionList} from 'react-native';
import {
  useTheme,
  Card,
  Appbar,
  Text,
  Subheading,
  Headline,
} from 'react-native-paper';

import {
  observeTransactions,
  observeCurrentYearTransactions,
} from '../../database/helpers';
import {TransactionProps, TransactionTypeEnum} from '../../database/models';
import {numToCurrency} from '../../constants';
import {styles} from './styles';

// interface
interface TransactionsProps {
  transactions: TransactionProps[];
  currentYearTransactions: TransactionProps[];
}

// Transaction component
const _Transactions: React.FC<TransactionsProps> = ({
  transactions,
  currentYearTransactions,
}) => {
  const {colors} = useTheme();

  // calculate total income
  const totalIncome = transactions.reduce(
    (sum: number, trans: TransactionProps) =>
      trans.transactionType == TransactionTypeEnum.income
        ? trans.amount + sum
        : sum,
    0,
  );
  // calculate total expense
  const totalExpense = transactions.reduce(
    (sum: number, trans: TransactionProps) =>
      trans.transactionType == TransactionTypeEnum.expense
        ? trans.amount + sum
        : sum,
    0,
  );
  // calculate total balance
  const balance = totalIncome - totalExpense;

  // prepare transactions for SectionList, grouped by month
  let transactionGroupedByMonth = currentYearTransactions.reduce(
    (groupedTransaction: any, transaction: TransactionProps): object => {
      const month = dayjs(transaction.transactionAt).format('MMMM');
      groupedTransaction[month] = groupedTransaction[month] || [];
      groupedTransaction[month] = [...groupedTransaction[month], transaction];

      return groupedTransaction;
    },
    Object.create(null),
  );
  transactionGroupedByMonth = Object.keys(transactionGroupedByMonth).map(
    key => ({title: key, data: transactionGroupedByMonth[key]}),
  );

  const textColor = (transactionType: TransactionTypeEnum | undefined) => ({
    color: transactionType === TransactionTypeEnum.expense ? 'red' : 'green',
  });

  const renderItem = ({item}: {item: TransactionProps}) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Card style={{marginBottom: 10}}>
          <Card.Content style={styles.container}>
            <View style={styles.textContainer}>
              <Text numberOfLines={2}>{item.notes}</Text>
              <Text style={{...styles.datetime, color: colors.disabled}}>
                {dayjs(item.transactionAt).format('DD')} {item.time}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={textColor(item.transactionType)}>
                {numToCurrency(item.amount)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="TRANSACTIONS" />
      </Appbar.Header>

      <Card style={{margin: 10}}>
        <Card.Content
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Subheading>Income</Subheading>
            <Subheading>Expense</Subheading>
            <Subheading>Balance</Subheading>
          </View>
          <View>
            <Subheading style={textColor(TransactionTypeEnum.income)}>
              {numToCurrency(totalIncome)}
            </Subheading>
            <Subheading style={textColor(TransactionTypeEnum.expense)}>
              {numToCurrency(totalExpense)}
            </Subheading>
            <Subheading
              style={textColor(
                balance > 0
                  ? TransactionTypeEnum.income
                  : TransactionTypeEnum.expense,
              )}>
              {numToCurrency(balance)}
            </Subheading>
          </View>
        </Card.Content>
      </Card>

      <View style={{flex: 1, marginBottom: 100, marginHorizontal: 10}}>
        <SectionList
          sections={transactionGroupedByMonth}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(item.id) + String(index)}
          renderSectionHeader={({section: {title}}) => (
            <Headline style={{marginBottom: 10, color: colors.primary}}>
              {title}
            </Headline>
          )}
        />
      </View>
    </>
  );
};

const enhance = withObservables([], () => ({
  transactions: observeTransactions(),
  currentYearTransactions: observeCurrentYearTransactions(),
}));

const Transactions = enhance(_Transactions);

export {Transactions};
