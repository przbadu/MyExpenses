import React from 'react';
import {Appearance} from 'react-native';
import {darkTheme, lightTheme} from '../../constants';
import {LocalStorage} from '../../database/helpers';

export const APP_THEME = 'APP_THEME';

export interface ThemeContentProps {
  theme: typeof darkTheme;
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = React.createContext<ThemeContentProps>({
  theme: darkTheme,
  toggleTheme: async () => {},
});

export const ThemeProvider = ({children}: any) => {
  const [theme, setTheme] = React.useState(darkTheme);

  React.useEffect(() => {
    setupTheme();
  }, []);

  const setupTheme = async () => {
    const systemTheme = getSystemTheme();
    const appTheme = await getAppTheme();

    if (appTheme) {
      setTheme(appTheme);
    } else {
      setTheme(systemTheme);
      await setAppTheme(systemTheme.dark);
    }
  };

  const getSystemTheme = () => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? darkTheme : lightTheme;
  };

  const getAppTheme = async () => {
    const appTheme = await LocalStorage.get(APP_THEME);
    if (appTheme === null || appTheme === undefined) return;

    return appTheme === 'dark' ? darkTheme : lightTheme;
  };

  const setAppTheme = async (dark: boolean) => {
    const appTheme = dark ? 'dark' : 'light';
    await LocalStorage.set(APP_THEME, appTheme);
  };

  // ability for app to toggle theme
  const toggleTheme = async () => {
    await setAppTheme(!theme.dark);
    theme.dark ? setTheme(lightTheme) : setTheme(darkTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
