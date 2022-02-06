import React, {forwardRef} from 'react';
import {TextProps} from 'react-native';
import {TextInput, HelperText, useTheme} from 'react-native-paper';
import {TextInputProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

type Props = TextInputProps & TextProps;

let AppTextInput = (props: Props, ref: any) => {
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
