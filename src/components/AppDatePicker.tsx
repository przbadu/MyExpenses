import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import {AppTextInput} from '.';

const AppDatePicker = (props: React.ComponentProps<typeof TextInput>) => {
  const {onPress} = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <AppTextInput
        underlineColor="transparent"
        showSoftInputOnFocus={false}
        editable={false}
        {...props}
      />
    </TouchableOpacity>
  );
};

export default AppDatePicker;
