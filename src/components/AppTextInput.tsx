import React from 'react';
import {TextInput, HelperText, useTheme} from 'react-native-paper';

const AppTextInput = (props: React.ComponentProps<typeof TextInput>) => {
  const {colors} = useTheme();

  return (
    <>
      <TextInput outlineColor={colors.disabled} {...props} />
      {props.error && (
        <HelperText
          type="error"
          visible={props.error}
          style={{marginTop: -15, marginBottom: 10}}>
          {props.errorMessage}
        </HelperText>
      )}
    </>
  );
};

export {AppTextInput};
