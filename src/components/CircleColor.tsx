import React from 'react';
import {View} from 'react-native';

const CircleColor: React.FC<{color: string | undefined}> = ({color}) => {
  if (color == undefined) return null;

  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 24,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

export {CircleColor};
