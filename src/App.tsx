import React from 'react';
import {View, Text} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  return (
    <PaperProvider>
      <View>
        <Icon name="facebook" color="tomato" style={{width: 32, height: 32}} />
        <Text>App View</Text>
      </View>
    </PaperProvider>
  );
};

export default App;
