import React from 'react';
import {Snackbar, Text, useTheme} from 'react-native-paper';
import {responsiveHeight} from '../../lib';

type Props = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
} & React.ComponentProps<typeof Snackbar>;

const AppSnackbar = ({visible, message, onDismiss, ...rest}: Props) => {
  const {colors} = useTheme();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={{
        position: 'absolute',
        bottom: responsiveHeight(12),
        backgroundColor: colors.surface,
      }}
      {...rest}>
      <Text>{message}</Text>
    </Snackbar>
  );
};

export default AppSnackbar;
