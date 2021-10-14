import React from 'react';
import {View} from 'react-native';
import {
  Button,
  Card,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {AppTextInput} from '../../components';
import {saveWallet, updateWallet} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {generateColor} from '../../lib';

const AddWallet = ({
  visible,
  wallet,
  hideModal,
  cancelEdit,
  handleDelete,
  onSubmitted,
}: {
  visible: boolean;
  wallet: Wallet | undefined;
  hideModal: () => void;
  cancelEdit: () => void;
  handleDelete: (wallet: Wallet | undefined) => void;
  onSubmitted: () => void;
}) => {
  const {colors} = useTheme();
  const [name, setName] = React.useState<string>('');
  const [color, setColor] = React.useState<string>(generateColor());
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
      onSubmitted();
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
    setColor(generateColor());
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
                  text.length < 1 ? setColor(generateColor()) : setColor(text)
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
            {wallet && (
              <Button
                onPress={() => handleDelete(wallet)}
                mode="outlined"
                color={colors.notification}
                style={{marginRight: 10, marginLeft: 10}}>
                Delete
              </Button>
            )}
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
