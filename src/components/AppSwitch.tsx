import React from 'react';
import {View, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';

interface AppSwitchProps {
  label: string;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const AppSwitch: React.FC<AppSwitchProps> = ({
  label,
  children,
  containerStyle,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...containerStyle,
      }}>
      <Text>{label}</Text>
      {children}
    </View>
  );
};

export {AppSwitch};
