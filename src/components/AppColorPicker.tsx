import React from 'react';
import {View, TouchableOpacity, ColorValue, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {hexToRGBA, responsiveWidth} from '../lib';

const AppColorPicker = ({
  color,
  selected,
  icon,
  size = responsiveWidth(10),
  containerStyles = {},
  onPress,
}: {
  color: ColorValue;
  selected?: boolean;
  icon?: string;
  size?: number;
  containerStyles?: ViewStyle;
  onPress?: () => void;
}) => {
  const {dark} = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: dark ? color : hexToRGBA(color, 0.2),
          width: size,
          height: size,
          borderRadius: 15,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
          ...containerStyles,
        }}>
        {selected || icon ? (
          <Icon
            name={icon?.toString().length ? icon : 'check'}
            color={dark ? '#FFFFFF' : (color as string)}
            size={24}
          />
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  );
};

export {AppColorPicker};
