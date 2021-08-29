import React, {useState, useEffect} from 'react';
import {Provider as PaperProvider, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import {AppNavigator} from './navigation';
import {lightTheme, darkTheme} from './constants';
import {initialSetup} from './database/helpers';
import {SplashScreen} from './screens';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    defaultSetup();
  }, []);

  const defaultSetup = async () => {
    const theme = await initialSetup();
    theme === 'dark' ? setTheme(darkTheme) : setTheme(lightTheme);
    setLoading(false);
  };

  if (loading) return <SplashScreen />;

  console.log('theme', theme);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
