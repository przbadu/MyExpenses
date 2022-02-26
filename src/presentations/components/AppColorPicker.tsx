import React from 'react';
import {
  View,
  TouchableOpacity,
  ColorValue,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {hexToRGBA, responsiveWidth} from '../../helpers';

type Props = {
  color: ColorValue;
  selected?: boolean;
  icon?: string;
  size?: number;
  containerStyles?: ViewStyle;
} & TouchableOpacityProps;

const AppColorPicker = ({
  color,
  selected,
  icon,
  size = responsiveWidth(10),
  containerStyles = {},
  onPress,
}: Props) => {
  const {dark} = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: dark ? hexToRGBA(color, 0.6) : hexToRGBA(color, 0.2),
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
            color={dark ? hexToRGBA('#FFFFFF', 0.7) : (color as string)}
            size={24}
          />
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AppColorPicker;
