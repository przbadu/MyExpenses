import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {TouchableOpacity, View, SectionList, ScrollView} from 'react-native';
import {
  useTheme,
  Card,
  Appbar,
  Text,
  Subheading,
  IconButton,
} from 'react-native-paper';

import {
  observeCurrentYearTransactions,
  transactionTypeSummary,
} from '../../database/helpers';
import {TransactionProps, TransactionTypeEnum} from '../../database/models';
import {COLORS, numberToCurrency} from '../../constants';
import {CurrencyContext, CurrencyContextProps} from '../../store/context';
import {styles} from './styles';
import {AppCalendar} from '../../components';
import {useNavigation} from '@react-navigation/core';

// interface
interface CalendarTransactionsProps {
  transactions: TransactionProps[];
}

// Transaction component
const _format = 'YYYY-MM-DD';
const _today = dayjs().format(_format);

const _Transactions: React.FC<CalendarTransactionsProps> = ({transactions}) => {
  const [summary, setSummary] = React.useState<
    [{sum_amount: number; transaction_type: TransactionTypeEnum}] | undefined
  >();
  const [balance, setBalance] = React.useState<number>(0);
  const [showCalendar, setShowCalendar] = React.useState(true);
  const [markedDates, setMarkedDates] = React.useState<any>({
    [_today]: {disabled: true, selected: true},
  });

  const navigation = useNavigation();
  const {colors} = useTheme();
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);

  React.useEffect(() => {
    fetchSummary();
  }, []);

  React.useEffect(() => {
    if (summary) {
      const result = summary.reduce(
        (sum, s) =>
          s.transaction_type == TransactionTypeEnum.income
            ? sum + s.sum_amount
            : sum - s.sum_amount,
        0,
      );
      setBalance(result);
    }
  }, [summary]);

  const fetchSummary = async () => {
    const res = await transactionTypeSummary();
    setSummary(res);
  };

  const onDaySelect = (day: any) => {
    let selected = true;
    const _selectedDay = dayjs(day.dateString).format(_format);

    if (markedDates[_selectedDay]) {
      selected = !markedDates[_selectedDay].selected;
    }

    setMarkedDates({...markedDates, ...{[_selectedDay]: {selected}}});
  };

  console.log(markedDates);

  // prepare transactions for SectionList, grouped by month
  let transactionGroupedByMonth = transactions.reduce(
    (groupedTransaction: any, transaction: TransactionProps): object => {
      const month = dayjs(transaction.transactionAt).format('YYYY MMM');
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
    color:
      transactionType === TransactionTypeEnum.expense
        ? COLORS.red
        : COLORS.green,
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
                {numberToCurrency(item.amount, currency)}
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
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={COLORS.white}
        />
        <Appbar.Content title="" />
        <Appbar.Action
          icon={showCalendar ? 'eye-off-outline' : 'eye-outline'}
          color={COLORS.white}
          onPress={() => setShowCalendar(!showCalendar)}
        />
      </Appbar.Header>

      {showCalendar && (
        <AppCalendar onDayPress={onDaySelect} markedDates={markedDates} />
      )}

      <Card style={{margin: 10}}>
        <Card.Content
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            {summary &&
              summary.map(s => (
                <Text key={s.transaction_type} style={{marginBottom: 5}}>
                  {s.transaction_type}
                </Text>
              ))}
            <Text>Balance</Text>
          </View>
          <View>
            {summary &&
              summary.map(s => (
                <Text
                  key={s.transaction_type}
                  style={{...textColor(s.transaction_type), marginBottom: 5}}>
                  {numberToCurrency(s.sum_amount, currency)}
                </Text>
              ))}
            <Text
              style={textColor(
                balance > 0
                  ? TransactionTypeEnum.income
                  : TransactionTypeEnum.expense,
              )}>
              {numberToCurrency(balance, currency)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={{flex: 1, marginHorizontal: 10}}>
        <SectionList
          sections={transactionGroupedByMonth}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(item.id) + String(index)}
          renderSectionHeader={({section: {title}}) => (
            <Subheading style={{marginBottom: 10, color: colors.primary}}>
              {title}
            </Subheading>
          )}
        />
      </View>
    </>
  );
};

const enhance = withObservables([], () => ({
  transactions: observeCurrentYearTransactions(),
}));

const CalendarTransactions = enhance(_Transactions);

export {CalendarTransactions};
