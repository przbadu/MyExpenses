import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

export const COLORS = {
  white: '#FFFFFF',
  pink: '#FF3378',
  primary: '#1AA471',
  secondary: '#FF6347',
  green: '#5cb85c',
  blue: '#28c2ff',
};

// customize ReactNativePaper colors
// Reference: https://callstack.github.io/react-native-paper/theming.html
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      success: string;
      white: string;
      lightBlue: string;
    }
  }
}

export const lightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    success: '#007E3C',
    white: '#FFFFFF',
    lightBlue: COLORS.primary,
  },
};

export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    // success: '#5CB85C',
    primary: COLORS.primary,
    // accent: COLORS.secondary,
    success: '#00C851',
    white: '#FFFFFF',
    lightBlue: '#4f626e',
  },
};
