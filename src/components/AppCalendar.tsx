import React from 'react';
import {useTheme} from 'react-native-paper';
import {Calendar} from 'react-native-calendars';
import {calendarTheme, COLORS} from '../constants';

const AppCalendar = (props: typeof Calendar) => {
  const {colors, dark} = useTheme();

  return (
    <Calendar
      theme={{
        ...calendarTheme,
        calendarBackground: colors.surface,
        backgroundColor: colors.background,
        textSectionTitleColor: colors.primary,
        textSectionTitleDisabledColor: colors.disabled,
        selectedDayBackgroundColor: colors.accent,
        selectedDayTextColor: COLORS.white,
        dayTextColor: dark ? colors.disabled : colors.text,
        textDayFontSize: 14,
        textMonthFontSize: 12,
        textDayHeaderFontSize: 12,
      }}
      {...props}
    />
  );
};

export {AppCalendar};
