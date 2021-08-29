import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';

interface TabBarCustomButtonProps {
  children: React.JSX;
  onPress: Function;
}

const TabBarCustomButton: React.FC<TabBarCustomButtonProps> = ({
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {children}
    </TouchableOpacity>
  );
};

export {TabBarCustomButton};
