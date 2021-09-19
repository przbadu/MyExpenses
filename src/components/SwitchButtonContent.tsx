import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constants';

const SwitchButtonContent: React.FC<{
  icon: string;
  label: string;
  active: boolean;
}> = ({icon, label, active}) => {
  const {colors, dark} = useTheme();

  const darkActiveBG = active ? colors.accent : colors.background;
  const lightActiveBG = active ? colors.primary : colors.background;

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: dark ? darkActiveBG : lightActiveBG,
      }}>
      {icon && (
        <Icon
          name={icon}
          style={{marginRight: 10}}
          color={active ? COLORS.white : colors.text}
          size={20}
        />
      )}
      {label && (
        <Text style={{color: active ? COLORS.white : colors.text}}>
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

export {SwitchButtonContent};
