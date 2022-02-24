import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {hexToRGBA} from '../../helpers';

type Props = {
  icon: string;
  label: string;
  active: boolean;
  containerStyle?: ViewStyle;
};

const SwitchButtonContent = ({icon, label, active, containerStyle}: Props) => {
  const {colors, dark} = useTheme();

  const darkActiveBG = active ? colors.lightBlue : colors.background;
  const lightActiveBG = active
    ? hexToRGBA(colors.lightBlue, 0.6)
    : colors.background;

  return (
    <View
      style={{
        backgroundColor: dark ? darkActiveBG : lightActiveBG,
        ...styles.container,
        ...containerStyle,
      }}>
      {icon && (
        <Icon
          name={icon}
          style={{marginRight: 10}}
          color={active ? colors.white : colors.text}
          size={20}
        />
      )}
      {label && (
        <Text style={{color: active ? colors.white : colors.text}}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 25,
    padding: 10,
    paddingVertical: 12,
    justifyContent: 'center',
  },
});

export default SwitchButtonContent;
