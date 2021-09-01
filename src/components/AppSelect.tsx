import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppSelectProps {
  onPress: (event: GestureResponderEvent) => void;
  placeholder: string;
  icon?: string;
  value?: string | null;
}
const AppSelect: React.FC<AppSelectProps> = ({
  onPress,
  icon,
  placeholder,
  value,
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        borderColor: colors.disabled,
      }}
      onPress={onPress}>
      {icon && (
        <Icon
          name={icon}
          color={colors.text}
          style={{fontSize: 24, marginRight: 10}}
        />
      )}
      <View style={styles.inputWrapper}>
        {value && (
          <Text style={{...styles.placeholder, color: colors.placeholder}}>
            {placeholder}
          </Text>
        )}
        <Text
          style={{
            ...styles.text,
            color: value ? colors.text : colors.placeholder,
          }}>
          {value ? value : placeholder}
        </Text>
      </View>
      <Icon name="menu-down" color={colors.text} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 15,
    padding: 15,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 6,
    borderTopEndRadius: 6,
    borderBottomWidth: 1,
  },
  inputWrapper: {
    flexGrow: 1,
    marginRight: 10,
  },
  placeholder: {
    fontSize: 12,
  },
  text: {
    fontSize: 18,
  },
  icon: {
    fontSize: 24,
  },
});

export {AppSelect};
