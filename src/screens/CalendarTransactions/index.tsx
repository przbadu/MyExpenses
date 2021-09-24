import dayjs from 'dayjs';
import React from 'react';
import {View, FlatList} from 'react-native';
import {useTheme, Subheading, IconButton} from 'react-native-paper';

import {
  filterByDailyTransactions,
  transactionDaysForCurrentMonth,
} from '../../database/helpers';
import {TransactionProps} from '../../database/models';
import {calendarTheme} from '../../constants';
import {Calendar} from 'react-native-calendars';
import {TransactionRow} from '../../components';

// Transaction component
const _format = 'YYYY-MM-DD';
const _today = dayjs().format(_format);

const CalendarTransactions = ({navigation}) => {
  const [transactions, setTransactions] = React.useState([]);
  const [markedDates, setMarkedDates] = React.useState<any>({
    [_today]: {selected: true},
  });

  const {colors, dark} = useTheme();

  React.useEffect(() => {
    const _date = dayjs().format('YYYY-MM');
    fetchFilteredTransactions(_today);
    fetchCurrentMonthDots(_date);
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
          renderItem={({item}: {item: TransactionProps}) => (
            <TransactionRow
              transaction={item}
              key={`transaction-row-${item.id}`}
            />
          )}
          keyExtractor={(item, index) => String(item.id) + String(index)}
        />
      </View>
    </>
  );
};

export {CalendarTransactions};
