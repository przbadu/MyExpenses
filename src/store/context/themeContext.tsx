import React from 'react';
import {LocalStorage} from '../../database/helpers';

export const APP_THEME = 'APP_THEME';

export type themeMode = 'light' | 'dark' | 'system';
export interface ThemeContentProps {
  theme: themeMode;
  changeTheme: (mode: themeMode) => Promise<void>;
}

export const ThemeContext = React.createContext<ThemeContentProps>({
  theme: 'system',
  changeTheme: async () => {},
});

export const ThemeProvider = ({
  initialTheme,
  children,
}: {
  initialTheme: themeMode;
  children: JSX.Element;
}) => {
  const [theme, setTheme] = React.useState<themeMode>(initialTheme);

  React.useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    const appTheme = (await LocalStorage.get(APP_THEME)) as themeMode | null;
    changeTheme(appTheme?.length ? appTheme : 'system');
  };

  async function changeTheme(appTheme: themeMode) {
    let _appTheme = appTheme;
    if (appTheme?.length) {
      setTheme(appTheme);
    } else {
      setTheme('system');
      _appTheme = 'system';
    }
    await LocalStorage.set(APP_THEME, _appTheme);
  }

  return (
    <ThemeContext.Provider value={{theme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
