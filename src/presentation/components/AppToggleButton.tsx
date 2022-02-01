import React from 'react';
import {ToggleButton, useTheme} from 'react-native-paper';

const AppToggleButton: React.FC<{
  icon: string;
  onPress: () => void;
  active: boolean;
  value?: string;
}> = ({icon, onPress, active, value}) => {
  const {colors} = useTheme();

  return (
    <ToggleButton
      icon={icon}
      onPress={onPress}
      value={value}
      style={{
        backgroundColor: active ? colors.primary : colors.surface,
      }}
      color={active ? colors.white : colors.primary}
    />
  );
};

export {AppToggleButton};
