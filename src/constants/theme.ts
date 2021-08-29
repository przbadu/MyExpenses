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

export const lightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#FF8B2D',
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
    primary: '#FF8B2D',
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
