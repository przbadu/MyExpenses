import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';

import AppModal from './AppModal';
import AppTextInput from './AppTextInput';

type Props = {
  renderContent: () => React.ReactNode;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  transparentAreaHeight: number;
  placeholder: string;
} & React.ComponentProps<typeof AppTextInput>;

const AppSelect = ({
  renderContent,
  open,
  onOpen,
  onClose,
  transparentAreaHeight,
  placeholder,
  ...rest
}: Props) => {
  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        <AppTextInput
          underlineColor="transparent"
          showSoftInputOnFocus={false}
          editable={false}
          right={<TextInput.Icon name="menu-down" onPress={onOpen} />}
          {...rest}
        />
      </TouchableOpacity>

      {open && (
        <AppModal
          visible={open}
          onClose={onClose}
          heading={placeholder}
          renderContent={renderContent}
          transparentAreaHeight={transparentAreaHeight}
        />
      )}
    </>
  );
};

export default AppSelect;
