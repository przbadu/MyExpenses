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
  // primary: '#FF3378',
  primary: '#FF6347',
  secondary: '#FF2278',
  red: '#d9534f',
  green: '#5cb85c',
  blue: '#28c2ff',
};

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
