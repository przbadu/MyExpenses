import React from 'react';
import {TouchableOpacityProps, ViewStyle} from 'react-native';
import {Chip, useTheme} from 'react-native-paper';
import {hexToRGBA} from '../../lib';

type Props = {
  surface?: boolean;
  children: React.ReactNode;
  selected: boolean;
  containerStyles?: ViewStyle;
} & TouchableOpacityProps;

const AppChip = ({selected, containerStyles, children, ...rest}: Props) => {
  const {colors} = useTheme();

  return (
    <Chip
      selectedColor={selected ? colors.white : colors.text}
      style={{
        backgroundColor: selected
          ? colors.primary
          : hexToRGBA(colors.primary, 0.2),
        marginRight: 10,
        maxHeight: 35,
        ...containerStyles,
      }}
      {...rest}>
      {children}
    </Chip>
  );
};

export {AppChip};
