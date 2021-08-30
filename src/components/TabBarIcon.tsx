import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TabBarIconProps {
  icon: string;
  label?: string;
  focused: boolean;
  containerStyles?: object;
  iconColor?: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  icon,
  label,
  focused,
  containerStyles = {},
  iconColor,
}) => {
  const {colors} = useTheme();
  const textColor = focused ? colors.primary : colors.disabled;

  return (
    <View style={[styles.container, containerStyles]}>
      <Icon
        name={icon}
        style={styles.icon}
        color={iconColor ? iconColor : textColor}
      />
      {label && <Text style={{color: textColor}}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
  },
  icon: {
    fontSize: 30,
  },
});

export {TabBarIcon};
