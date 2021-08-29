import React from 'react';
import {View, Text} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
  return (
    <PaperProvider>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="home" color="tomato" style={{fontSize: 32}} />
        <Text>Home Page Screen</Text>
      </View>
    </PaperProvider>
  );
};

export default App;
