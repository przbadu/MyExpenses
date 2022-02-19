import React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';

type Props = {
  visible: boolean;
  title: string;
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({visible, label, title, onCancel, onConfirm}: Props) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{label}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onConfirm}>Yes</Button>
          <Button onPress={onCancel}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;
