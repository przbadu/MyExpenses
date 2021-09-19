import React from 'react';
import {TextInput, HelperText, useTheme} from 'react-native-paper';

const AppTextInput = (props: React.ComponentProps<typeof TextInput>) => {
  const {colors} = useTheme();

  return (
    <>
      <TextInput outlineColor={colors.disabled} mode="outlined" {...props} />
      {props.error && (
        <HelperText type="error" visible={props.error}>
          {props.error}
        </HelperText>
      )}
    </>
  );
};

export {AppTextInput};
