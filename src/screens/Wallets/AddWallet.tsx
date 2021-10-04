import randomColor from 'randomcolor';
import React from 'react';
import {View} from 'react-native';
import {Button, Card, Modal, Portal, TextInput} from 'react-native-paper';
import {AppTextInput} from '../../components';
import {saveWallet, updateWallet} from '../../database/helpers';
import {Wallet} from '../../database/models';

const AddWallet = ({
  visible,
  wallet,
  hideModal,
  cancelEdit,
}: {
  visible: boolean;
  wallet: Wallet | undefined;
  hideModal: () => void;
  cancelEdit: () => void;
}) => {
  const [name, setName] = React.useState<string>('');
  const [color, setColor] = React.useState<string>(randomColor());
  const [errors, setErrors] = React.useState<{name: string | undefined}>({
    name: undefined,
  });

  React.useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setColor(wallet.color);
    }
  }, [wallet]);

  const handleSubmit = async () => {
    if (!name.length) {
      setErrors({...errors, name: 'Name is required'});
    } else {
      if (wallet) await updateWallet(wallet, {name, color});
      else await saveWallet({name, color});
      beforeHideModal();
    }
  };

  function beforeHideModal() {
    setName('');
    resetColor();
    setErrors({name: undefined});
    cancelEdit();
    hideModal();
  }

  function resetColor() {
    setColor(randomColor());
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal}>
        <Card style={{marginHorizontal: 10}}>
          <Card.Title title="Add New Wallet" />
          <Card.Content style={{marginBottom: 20}}>
            <AppTextInput
              placeholder="Enter wallet name"
              value={name}
              onChangeText={text => setName(text)}
              error={errors.name}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppTextInput
                value={color}
                onChangeText={text =>
                  text.length < 1 ? setColor(randomColor()) : setColor(text)
                }
                style={{flex: 1, backgroundColor: color}}
                right={<TextInput.Icon name="refresh" onPress={resetColor} />}
              />
            </View>
          </Card.Content>

          <Card.Actions>
            <Button
              onPress={handleSubmit}
              mode="contained"
              style={{marginRight: 10, marginLeft: 10}}>
              Save
            </Button>
            <Button onPress={beforeHideModal} mode="outlined">
              Cancel
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export {AddWallet};
