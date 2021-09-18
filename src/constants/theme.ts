import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

// READ MORE:
// https://callstack.github.io/react-native-paper/theming.html

export const COLORS = {
  white: '#FFFFFF',
  // primary: '#FF3378',
  primary: '#FF2278',
  secondary: '#FF6347',
  red: '#d9534f',
  green: '#5cb85c',
  blue: '#28c2ff',
};

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
  monthTextColor: 'blue',
  indicatorColor: 'blue',
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

export const lightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    // accent: '#FFC597',
    // background: '',
    // surface: '',
    // text: '',
    // disabled: '',
    // placeholder: '',
    // backdrop: '',
    // onSurface: '',
    // notification: '',
  },
};

export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    // primary: COLORS.primary,
    // accent: COLORS.secondary,
    // accent: '#FFC597',
    // background: '',
    // surface: '',
    // text: '',
    // disabled: '',
    // placeholder: '',
    // backdrop: '',
    // onSurface: '',
    // notification: '',
  },
};
