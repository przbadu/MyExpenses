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
  // primary: '#FF2278',
  primary: '#3C27BE',
  // secondary: '#FF6347',
  secondary: '#8C7BBC',
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
    interface Theme {
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
    lightBlue: '#abc95f',
  },
};

export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    // success: '#5CB85C',
    success: '#00C851',
    white: '#FFFFFF',
    lightBlue: '#4f626e',
  },
};