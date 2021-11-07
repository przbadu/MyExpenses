import React from 'react';
import {View, TouchableOpacity, ColorValue, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {responsiveWidth} from '../lib';

const AppColorPicker = ({
  color,
  selected,
  icon,
  size = responsiveWidth(12),
  containerStyles = {},
  onPress,
}: {
  color: ColorValue;
  selected?: boolean;
  icon?: string;
  size?: number;
  containerStyles?: ViewStyle;
  onPress?: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size,
        marginRight: 20,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        ...containerStyles,
      }}>
      {selected || icon ? (
        <Icon
          name={icon?.toString().length ? icon : 'check'}
          color="#ffffff"
          size={24}
        />
      ) : (
        <View />
      )}
    </View>
  </TouchableOpacity>
);

export {AppColorPicker};
