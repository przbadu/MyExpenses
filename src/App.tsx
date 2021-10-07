import React, {useEffect, useState} from 'react';
import {initialSetup} from './database/helpers';
import {AppNavigator} from './navigation';
import {SplashScreen} from './screens';
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
  };

  if (loading) return <SplashScreen />;

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AppNavigator />
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
