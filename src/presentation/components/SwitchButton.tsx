import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

type Props = {
  label?: string;
  icon?: string;
  containerStyles?: ViewStyle;
} & TouchableWithoutFeedbackProps;

const SwitchButton = ({containerStyles, children, onPress}: Props) => {
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

export default SwitchButton;
