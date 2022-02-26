import React, {forwardRef} from 'react';
import {TextInput, HelperText, useTheme} from 'react-native-paper';

type Props = React.ComponentProps<typeof TextInput>;

const AppTextInput = forwardRef<typeof TextInput, Props>(
  (props: Props, ref: any) => {
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
  },
);

export default AppTextInput;
