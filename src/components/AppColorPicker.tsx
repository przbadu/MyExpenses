import React from 'react';
import {View, TouchableOpacity, ColorValue} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {responsiveWidth} from '../lib';

const AppColorPicker = ({
  color,
  selected,
  icon,
  onPress,
}: {
  color: ColorValue;
  selected?: boolean;
  icon?: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: color,
          width: responsiveWidth(12),
          height: responsiveWidth(12),
          borderRadius: responsiveWidth(20),
          marginRight: 20,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {(selected || icon) && (
          <Icon name={icon || 'check'} color="#ffffff" size={24} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AppColorPicker;
