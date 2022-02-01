import React from 'react';
import {Snackbar, Text, useTheme} from 'react-native-paper';
import {hexToRGBA, responsiveHeight} from '../../lib';

const AppSnackbar: React.FC<{
  visible: boolean;
  onDismiss: () => void;
  message: string;
}> = ({visible, message, onDismiss}) => {
  const {colors, dark} = useTheme();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={{
        position: 'absolute',
        bottom: responsiveHeight(12),
        backgroundColor: colors.surface,
      }}>
      <Text>{message}</Text>
    </Snackbar>
  );
};

export {AppSnackbar};
