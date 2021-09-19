import React from 'react';
import {TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput} from 'react-native-paper';
import {AppTextInput} from '.';

const AppDatePicker = (props: React.ComponentProps<typeof TextInput>) => {
  const [open, setOpen] = React.useState(false);
  const {onConfirm} = props;

  console.log('valu', props.value);

  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      <AppTextInput
        underlineColor="transparent"
        showSoftInputOnFocus={false}
        editable={false}
        left={<TextInput.Icon name="calendar" />}
        {...props}
      />
      {open && (
        <DateTimePicker
          date={props.date}
          isVisible={open}
          mode="date"
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

export default AppDatePicker;
