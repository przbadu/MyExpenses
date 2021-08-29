import React, {useState, useEffect} from 'react';
// global states
import {ThemeProvider} from './store/context/themeContext';

import {AppNavigator} from './navigation';
import {initialSetup} from './database/helpers';
import {SplashScreen} from './screens';

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
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
