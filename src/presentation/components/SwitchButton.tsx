import React from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderEvent,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

interface SwitchButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label?: string;
  icon?: string;
  containerStyles?: ViewStyle;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  onPress,
  containerStyles,
  children,
}) => {
  const {colors} = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          ...styles.container,
          backgroundColor: colors.background,
          borderColor: colors.disabled,
          ...containerStyles,
        }}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 30,
    padding: 5,
    flexDirection: 'row',
    borderWidth: 1,
  },
});

export {SwitchButton};
