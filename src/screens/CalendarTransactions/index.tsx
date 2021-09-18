import dayjs from 'dayjs';
import React from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import {useTheme, Card, Text, Subheading, IconButton} from 'react-native-paper';

import {
  filterByDailyTransactions,
  observeTransactions,
  transactionDaysForCurrentMonth,
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

const CalendarTransactions = () => {
  const [transactions, setTransactions] = React.useState([]);
  const [markedDates, setMarkedDates] = React.useState<any>({
    [_today]: {selected: true},
  });

  const navigation = useNavigation();
  const {colors, dark} = useTheme();
  const {currency} = React.useContext<CurrencyContextProps>(CurrencyContext);

  React.useEffect(() => {
    const _date = dayjs().format('YYYY-MM');
    fetchCurrentMonthDots(_date);
    filterByDailyTransactions(_today);
  }, []);

  const fetchCurrentMonthDots = async (date: string) => {
    const result = await transactionDaysForCurrentMonth(date);
    let _dates: any = {};
    result.forEach((day: {transaction_at: number}) => {
      const _key = dayjs(day.transaction_at).format(_format);
      _dates[_key] = {...markedDates[_key], marked: true};
    });
    setMarkedDates(_dates);
  };

  const fetchFilteredTransactions = async (date: string) => {
    const result = await filterByDailyTransactions(date);
    setTransactions(result);
  };

  const onDaySelect = (day: any) => {
    // reset selected for all dates
    let _dates: any = {};
    const _selectedDay = dayjs(day.dateString).format(_format);

    Object.keys(markedDates).forEach(key => {
      _dates[key] = {...markedDates[key], selected: false};
    });
    _dates[_selectedDay] = {...markedDates[_selectedDay], selected: true};

    setMarkedDates(_dates);
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
            style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              color: colors.accent,
            }}>
            Daily Transactions
          </Subheading>
        </View>

        <Calendar
          onDayPress={onDaySelect}
          onMonthChange={({dateString}: {dateString: string}) => {
            const [year, month] = dateString.split('-');
            fetchCurrentMonthDots(`${year}-${month}`);
          }}
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

export {CalendarTransactions};
