import React from 'react';
import {Modal, Text, GestureResponderEvent} from 'react-native';

interface AppModalProps {
  onClose: () => void;
  show: boolean;
}
const AppModal: React.FC<AppModalProps> = ({onClose, show = false}) => {
  return (
    <Modal onRequestClose={onClose}>
      <Text>AppModal</Text>
    </Modal>
  );
};

export {AppModal};
