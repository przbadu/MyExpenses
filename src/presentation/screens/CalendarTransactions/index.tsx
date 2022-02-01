import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {IconButton, Subheading, useTheme} from 'react-native-paper';
import {TransactionRow} from '../../components';
import {calendarTheme} from '../../../lib';
import {
  filterByDailyTransactions,
  observeTransactions,
  transactionDaysForCurrentMonth,
} from '../../../database/helpers';
import {Transaction} from '../../../database/models';
import {SafeAreaView} from 'react-native-safe-area-context';

// Transaction component
const _format = 'YYYY-MM-DD';
const _today = dayjs().format(_format);

const _CalendarTransactions = ({
  navigation,
  transactions,
}: {
  navigation: any;
  transactions: Transaction[];
}) => {
  const [_transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [markedDates, setMarkedDates] = React.useState<any>({
    [_today]: {selected: true},
  });

  const {colors, dark} = useTheme();

  React.useEffect(() => {
    const _date = dayjs().format('YYYY-MM');
    fetchFilteredTransactions(_today);
    fetchCurrentMonthDots(_date);
  }, [transactions]);

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
    const result = (await filterByDailyTransactions(date)) as Transaction[];
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
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
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

      <FlatList
        data={_transactions}
        ListHeaderComponent={
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
        }
        renderItem={({item}) => (
          <View style={{marginHorizontal: 5, marginTop: 15}}>
            <TransactionRow
              transaction={item}
              key={`transaction-row-${item.id}`}
              onPress={() =>
                navigation.navigate('TransactionDetail', {
                  transactionId: item.id,
                })
              }
            />
          </View>
        )}
        keyExtractor={(item, index) => String(item.id) + String(index)}
      />
    </SafeAreaView>
  );
};

const CalendarTransactions = withObservables([], () => ({
  transactions: observeTransactions(),
}))(_CalendarTransactions);

export {CalendarTransactions};
