import React from 'react';
import {Chip, useTheme} from 'react-native-paper';

const AppChip = (props: any) => {
  const {colors} = useTheme();

  return (
    <Chip
      style={{
        backgroundColor: props.surface ? colors.surface : colors.background,
        marginRight: 10,
        maxHeight: 35,
        ...props.style,
      }}
      {...props}>
      {props.children}
    </Chip>
  );
};

export {AppChip};
