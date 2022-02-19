import React from 'react';
import {ToggleButton, useTheme} from 'react-native-paper';

type Props = {
  active: boolean;
} & React.ComponentProps<typeof ToggleButton>;

const AppToggleButton = ({active, ...rest}: Props) => {
  const {colors} = useTheme();

  return (
    <ToggleButton
      style={{
        backgroundColor: active ? colors.primary : colors.surface,
      }}
      color={active ? colors.white : colors.primary}
      {...rest}
    />
  );
};

export default AppToggleButton;
