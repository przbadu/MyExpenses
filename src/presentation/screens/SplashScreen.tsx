import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';

const SplashScreen = () => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1AA471',
      }}>
      <ActivityIndicator animating={true} color={colors.accent} />
      <Text style={{marginTop: 10, color: colors.white}}>
        preparing your data, please wait...
      </Text>
    </View>
  );
};

export {SplashScreen};
