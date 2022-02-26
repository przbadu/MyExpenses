import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Colors, Text} from 'react-native-paper';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1AA471',
      }}>
      <ActivityIndicator animating={true} color={Colors.white} />
      <Text style={{marginTop: 10, color: Colors.white}}>
        preparing your data, please wait...
      </Text>
    </View>
  );
};

export default SplashScreen;
