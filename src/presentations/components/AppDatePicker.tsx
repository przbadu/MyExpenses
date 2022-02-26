import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput, useTheme} from 'react-native-paper';
import AppTextInput from './AppTextInput';

type Props = {
  onConfirm: (value: Date) => void;
  date?: Date;
} & TouchableOpacityProps &
  React.ComponentProps<typeof AppTextInput>;

const AppDatePicker = ({onConfirm, date, ...rest}: Props) => {
  const [open, setOpen] = React.useState(false);
  const {dark} = useTheme();

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
        {...rest}
      />
      {open && (
        <DateTimePicker
          date={date}
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

export default AppDatePicker;
