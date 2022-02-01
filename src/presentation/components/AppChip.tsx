import React from 'react';
import {Chip, useTheme} from 'react-native-paper';
import {hexToRGBA} from '../../lib';

const AppChip = (props: any) => {
  const {colors} = useTheme();

  return (
    <Chip
      selectedColor={props.selected ? colors.white : colors.text}
      style={{
        backgroundColor: props.selected
          ? colors.primary
          : hexToRGBA(colors.primary, 0.2),
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
