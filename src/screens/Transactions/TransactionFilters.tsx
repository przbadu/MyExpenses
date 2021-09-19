import {useTheme} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput} from 'react-native-paper';
import AppDatePicker from '../../components/AppDatePicker';
import {DefaultDateFormat} from '../../constants';

const TransactionFilters = () => {
  const [startDate, setStartDate] = React.useState(
    dayjs().format(DefaultDateFormat),
  );
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleCalendarChange = (value: Date) => {
    setStartDate(dayjs(value).format(DefaultDateFormat));
    setShowCalendar(false);
  };

  return (
    <>
      <AppDatePicker
        label="Start Date"
        left={
          <TextInput.Icon
            name="calendar"
            onPress={() => setShowCalendar(true)}
          />
        }
        showSoftInputOnFocus={false}
        underlineColor="transparent"
        value={startDate}
        onPress={() => setShowCalendar(true)}
      />
      <DateTimePicker
        isVisible={showCalendar}
        mode="date"
        display="default"
        onConfirm={handleCalendarChange}
        onCancel={() => setShowCalendar(false)}
      />
    </>
  );
};

export default TransactionFilters;
