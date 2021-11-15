import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuItem = ({
  label,
  chipLabel,
  icon = 'menu-right',
  iconSize = 24,
  onPress,
}: {
  label: string;
  chipLabel?: string;
  icon?: string;
  iconSize?: number;
  onPress: () => void;
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity style={styles.textMenu} onPress={onPress}>
      <Text>{label}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {chipLabel && (
          <Text style={{color: colors.disabled, textTransform: 'uppercase'}}>
            {chipLabel}
          </Text>
        )}
        <Icon name={icon} color={colors.disabled} size={iconSize} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textMenu: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export {MenuItem};
