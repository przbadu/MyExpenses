import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  label: string;
  chipLabel?: string;
  icon?: string;
  iconSize?: number;
  loading?: boolean;
  children?: JSX.Element;
} & TouchableOpacityProps;

const MenuItem = ({
  label,
  chipLabel,
  icon = 'menu-right',
  iconSize = 24,
  loading = false,
  children,
  onPress,
}: Props) => {
  const {colors} = useTheme();

  function renderChildren() {
    if (children) return children;

    return (
      <>
        {chipLabel && (
          <Text style={{color: colors.disabled, textTransform: 'uppercase'}}>
            {chipLabel}
          </Text>
        )}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Icon name={icon} color={colors.disabled} size={iconSize} />
        )}
      </>
    );
  }

  return (
    <TouchableOpacity style={styles.textMenu} onPress={onPress}>
      <Text>{label}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {renderChildren()}
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

export default MenuItem;
