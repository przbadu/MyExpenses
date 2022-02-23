import React, {Suspense, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import {LocalStorage} from './helpers';
import {SplashScreen as AppSplashScreen} from './presentations/screens';
import Routes from './presentations/navigation/Routes';
import {
  APP_THEME,
  CurrencyProvider,
  ThemeProvider,
  themeMode,
} from './presentations/contexts';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<themeMode>('dark');

  useEffect(() => {
    _setup();
  }, []);

  // TODO: Fix Google Drive Sync setup, reference old code
  async function _setup() {
    const appTheme = (await LocalStorage.get(APP_THEME)) as themeMode;
    setTheme(appTheme?.length ? appTheme : 'system');
    setLoading(false);
    SplashScreen.hide();
  }

  console.log(loading);
  if (loading) return <AppSplashScreen />;

  return (
    <ThemeProvider initialTheme={theme}>
      <CurrencyProvider>
        <Suspense fallback={<ActivityIndicator />}>
          <Routes />
        </Suspense>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
