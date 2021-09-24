import {COLORS} from '.';

// Customize calendar theme
export const calendarTheme = (
  colors: ReactNativePaper.ThemeColors,
  dark?: boolean,
) => ({
  calendarBackground: colors.surface,
  backgroundColor: colors.background,
  textSectionTitleColor: colors.primary,
  textSectionTitleDisabledColor: colors.disabled,
  selectedDayBackgroundColor: colors.primary,
  dayTextColor: dark ? colors.disabled : colors.text,
  selectedDayTextColor: COLORS.white,
  todayTextColor: colors.primary,
  textDisabledColor: '#d9e1e8',
  dotColor: colors.primary,
  selectedDotColor: COLORS.white,
  arrowColor: colors.primary,
  disabledArrowColor: '#d9e1e8',
  monthTextColor: colors.primary,
  indicatorColor: colors.primary,
  // textDayFontFamily: 'monospace',
  // textMonthFontFamily: 'monospace',
  // textDayHeaderFontFamily: 'monospace',
  textDayFontWeight: '300',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 14,
  textMonthFontSize: 12,
  textDayHeaderFontSize: 12,
});
