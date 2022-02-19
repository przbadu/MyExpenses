import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

type Props = {
  label: string;
  children?: React.ReactNode;
};

const AppSwitch = ({label, children}: Props) => {
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

export default AppSwitch;
