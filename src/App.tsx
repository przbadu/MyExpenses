import React from 'react';
import {View, Text} from 'react-native';
import {Provider as PaperProvider, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
  return (
    <PaperProvider>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Button icon="home">Home Screen</Button>
      </View>
    </PaperProvider>
  );
};

export default App;
