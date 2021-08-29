import React from 'react';
import {Provider as PaperProvider, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import {TabNavigation} from './navigation';
import {lightTheme, darkTheme} from './constants';

const App = () => {
  const [theme, setTheme] = React.useState(darkTheme);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <TabNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
