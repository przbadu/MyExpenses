import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

interface AppSwitchProps {
  label: string;
  children?: React.JSX;
}

const AppSwitch: React.FC<AppSwitchProps> = ({label, children}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text>{label}</Text>
      {children}
    </View>
  );
};

export {AppSwitch};
