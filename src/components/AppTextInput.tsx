import React, {forwardRef} from 'react';
import {TextInput, HelperText, useTheme} from 'react-native-paper';

let AppTextInput = (
  props: React.ComponentProps<typeof TextInput>,
  ref: any,
) => {
  const {colors} = useTheme();

  return (
    <>
      <TextInput
        outlineColor={colors.disabled}
        mode="outlined"
        {...props}
        ref={ref}
      />
      {props.error && (
        <HelperText type="error" visible={props.error}>
          {props.error}
        </HelperText>
      )}
    </>
  );
};

AppTextInput = forwardRef(AppTextInput);

export {AppTextInput};
