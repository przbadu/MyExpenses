import React, {Suspense, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {initialSetup, LocalStorage} from './database/helpers';
import {AppNavigator} from './navigation';
import {SplashScreen as AppSplashScreen} from './screens';
// global states
import {
  APP_THEME,
  CurrencyProvider,
  themeMode,
  ThemeProvider,
} from './store/context';
import {DatabaseSynchronizer} from './sync/DatabaseSync';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<themeMode>('dark');

  useEffect(() => {
    defaultSetup();
  }, []);

  const prepareForDatabaseUpdate = async (): Promise<void> => {
    setLoading(true);
    // return database.close();
  };

  async function defaultSetup() {
    // setup default data
    await initialSetup();
    new DatabaseSynchronizer(prepareForDatabaseUpdate).syncDatabase();
    // setup theme
    const appTheme = (await LocalStorage.get(APP_THEME)) as themeMode;
    setTheme(appTheme?.length ? appTheme : 'system');
    setLoading(false);
    SplashScreen.hide();
  }

  if (loading) return <AppSplashScreen />;

  return (
    <ThemeProvider initialTheme={theme}>
      <CurrencyProvider>
        <Suspense fallback={<ActivityIndicator />}>
          <AppNavigator />
        </Suspense>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
