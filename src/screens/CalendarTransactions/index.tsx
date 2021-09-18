import dayjs from 'dayjs';
import React from 'react';
import {
  TouchableOpacity,
  View,
  SectionList,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  useTheme,
  Card,
  Appbar,
  Text,
  Subheading,
  IconButton,
} from 'react-native-paper';

import {
  filterByDailyTransactions,
  observeCalendarDots,
  transactionTypeSummary,
} from '../../database/helpers';
import {TransactionProps, TransactionTypeEnum} from '../../database/models';
import {calendarTheme, COLORS, numberToCurrency} from '../../constants';
import {CurrencyContext, CurrencyContextProps} from '../../store/context';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/core';
import {Calendar} from 'react-native-calendars';
import withObservables from '@nozbe/with-observables';

// Transaction component
const _format = 'YYYY-MM-DD';
const _today = dayjs().format(_format);

const _CalendarTransactions: React.FC<{transactionDates: string[]}> = ({
  transactionDates,
}) => {
  const [transactions, setTransactions] = React.useState([]);
  const [markedDates, setMarkedDates] = React.useState<any>({
    [_today]: {disabled: true, selected: true},
  });

  const navigation = useNavigation();
  const {colors, dark} = useTheme();
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);

  React.useEffect(() => {
    filterByDailyTransactions(_today);
  }, []);

  console.log('transaction dates', transactionDates);

  const fetchFilteredTransactions = async (date: string) => {
    const res = await filterByDailyTransactions(date);
    setTransactions(res);
  };

  const onDaySelect = (day: any) => {
    const _selectedDay = dayjs(day.dateString).format(_format);
    setMarkedDates({[_selectedDay]: {selected: true}});
    fetchFilteredTransactions(_selectedDay);
  };

  const textColor = (transactionType: TransactionTypeEnum | undefined) => ({
    color:
      transactionType === TransactionTypeEnum.expense
        ? COLORS.red
        : COLORS.green,
  });

  const renderItem = ({item}: {item: TransactionProps}) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Card style={{marginBottom: 5, elevation: 0}}>
          <Card.Content style={styles.container}>
            <View style={styles.textContainer}>
              <Text numberOfLines={2}>{item.notes}</Text>
              <Text style={{...styles.datetime, color: colors.disabled}}>
                {dayjs(item.transactionAt).format('MMM DD')} {item.time}
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
      <View style={{backgroundColor: colors.surface}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon="keyboard-backspace"
            onPress={() => navigation.goBack()}
          />
          <Subheading
            style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>
            Daily Transactions
          </Subheading>
        </View>

        <Calendar
          onDayPress={onDaySelect}
          markedDates={markedDates}
          theme={{
            ...calendarTheme(colors, dark),
          }}
        />
      </View>

      <View style={{flex: 1, marginHorizontal: 10, marginTop: 15}}>
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(item.id) + String(index)}
        />
      </View>
    </>
  );
};

const enhance = withObservables([], () => ({
  transactionDates: observeCalendarDots(),
}));

const CalendarTransactions = enhance(_CalendarTransactions);

export {CalendarTransactions};
