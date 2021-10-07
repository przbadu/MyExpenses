import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import {AppModal, AppTextInput} from './index';

const AppSelect = (props: React.ComponentProps<typeof AppTextInput>) => {
  const {renderContent, open, onOpen, onClose, transparentAreaHeight} = props;

  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        <AppTextInput
          underlineColor="transparent"
          showSoftInputOnFocus={false}
          editable={false}
          right={<TextInput.Icon name="menu-down" onPress={onOpen} />}
          {...props}
        />
      </TouchableOpacity>

      {open && (
        <AppModal
          visible={open}
          onClose={onClose}
          heading={props.placeholder!}
          renderContent={renderContent}
          transparentAreaHeight={transparentAreaHeight}
        />
      )}
    </>
  );
};

export {AppSelect};
