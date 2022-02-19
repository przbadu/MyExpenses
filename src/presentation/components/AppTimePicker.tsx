import React from 'react';
import {TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput, useTheme} from 'react-native-paper';
import AppTextInput from './AppTextInput';

type Props = {
  onConfirm: (value: Date) => void;
} & React.ComponentProps<typeof AppTextInput>;

const AppTimePicker = ({onConfirm, ...rest}: Props) => {
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
            name="clock-time-three-outline"
            onPress={() => setOpen(true)}
          />
        }
        {...rest}
      />
      {open && (
        <DateTimePicker
          isVisible={open}
          mode="time"
          isDarkModeEnabled={dark}
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

export default AppTimePicker;
