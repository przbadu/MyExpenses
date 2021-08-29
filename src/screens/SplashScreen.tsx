import React from 'react';
import {View} from 'react-native';
import {
  Text,
  Surface,
  ActivityIndicator,
  Colors,
  useTheme,
} from 'react-native-paper';

const SplashScreen = () => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
      <Surface
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 2,
          padding: 10,
        }}>
        <ActivityIndicator animating={true} color={Colors.red500} />
        <Text style={{marginTop: 10}}>preparing your data, please wait...</Text>
      </Surface>
    </View>
  );
};

export {SplashScreen};
