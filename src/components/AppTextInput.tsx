import React from 'react';
import {TextInput, useTheme} from 'react-native-paper';

const AppTextInput = (props: React.ComponentProps<typeof TextInput>) => {
  const {colors} = useTheme();

  return <TextInput outlineColor={colors.disabled} {...props} />;
};

export {AppTextInput};