import React from 'react';
import {Chip, useTheme} from 'react-native-paper';

const AppChip = (props: any) => {
  const {colors} = useTheme();

  return (
    <Chip
      style={{
        backgroundColor: colors.surface,
        marginRight: 10,
      }}
      {...props}>
      {props.children}
    </Chip>
  );
};

export {AppChip};
