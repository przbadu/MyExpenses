import React from 'react';
import {TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput} from 'react-native-paper';
import {AppTextInput} from '.';

const AppTimePicker = (props: React.ComponentProps<typeof TextInput>) => {
  const [open, setOpen] = React.useState(false);
  const {onConfirm} = props;

  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      <AppTextInput
        underlineColor="transparent"
        showSoftInputOnFocus={false}
        editable={false}
        left={
          <TextInput.Icon
            name="clock-time-three-outline"
            onPress={() => setOpen(true)}
          />
        }
        {...props}
      />
      {open && (
        <DateTimePicker
          isVisible={open}
          mode="time"
          display="default"
          onConfirm={value => {
            setOpen(false);
            onConfirm(value);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </TouchableOpacity>
  );
};

export {AppTimePicker};
