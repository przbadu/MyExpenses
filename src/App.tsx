import React, {Suspense, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {initialSetup} from './database/helpers';
import {AppNavigator} from './navigation';
import {SplashScreen as AppSplashScreen} from './screens';
// global states
import {CurrencyProvider, ThemeProvider} from './store/context';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    defaultSetup();
  }, []);

  const defaultSetup = async () => {
    await initialSetup();
    setLoading(false);
    SplashScreen.hide();
  };

  if (loading) return <AppSplashScreen />;

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <Suspense fallback={<ActivityIndicator />}>
          <AppNavigator />
        </Suspense>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
