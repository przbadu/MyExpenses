import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TabBarIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({icon, label, focused}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        style={styles.icon}
        color={focused ? colors.primary : colors.disabled}
      />
      <Text style={{color: focused ? colors.primary : colors.disabled}}>
        {label}
      </Text>
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

export default TabBarIcon;
