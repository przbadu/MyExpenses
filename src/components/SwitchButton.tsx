import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SwitchButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label?: string;
  icon?: string;
  isActive?: boolean;
  uppercase?: boolean;
  containerStyles?: StyleProp<ViewStyle> | {};
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  onPress,
  label,
  icon,
  isActive = false,
  uppercase = true,
  containerStyles = {},
}) => {
  const {colors} = useTheme();
  const textColor = isActive ? colors.primary : colors.disabled;

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        borderWidth: 1,
        borderColor: textColor,
        backgroundColor: colors.background,
        ...containerStyles,
      }}
      onPress={onPress}>
      <>
        {icon && (
          <Icon
            name={icon}
            color={textColor}
            style={{marginRight: label ? 10 : 0, fontSize: 18}}
          />
        )}
        {label && (
          <Text style={{color: isActive ? colors.primary : colors.text}}>
            {uppercase ? label.toUpperCase() : label}
          </Text>
        )}
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 6,
    borderTopEndRadius: 6,
  },
});

export {SwitchButton};
