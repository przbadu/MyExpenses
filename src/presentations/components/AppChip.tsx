import React from 'react';
import {ViewStyle} from 'react-native';
import {Chip, useTheme} from 'react-native-paper';
import {hexToRGBA} from '../../helpers';

type Props = {
  selected?: boolean;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
} & React.ComponentProps<typeof Chip>;

const AppChip = ({selected, children, containerStyle, ...rest}: Props) => {
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
        ...containerStyle,
      }}
      {...rest}>
      {children}
    </Chip>
  );
};

export default AppChip;
