import React from 'react';
import {TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput, useTheme} from 'react-native-paper';
import {AppTextInput} from '.';

const AppDatePicker = (props: React.ComponentProps<typeof TextInput>) => {
  const [open, setOpen] = React.useState(false);
  const {dark} = useTheme();
  const {onConfirm} = props;

  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      <AppTextInput
        underlineColor="transparent"
        showSoftInputOnFocus={false}
        editable={false}
        left={
          <TextInput.Icon
            name="calendar-blank-outline"
            onPress={() => setOpen(true)}
          />
        }
        {...props}
      />
      {open && (
        <DateTimePicker
          date={props.date}
          isVisible={open}
          mode="date"
          display="default"
          isDarkModeEnabled={dark}
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

export {AppDatePicker};
