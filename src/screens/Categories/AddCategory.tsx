import randomColor from 'randomcolor';
import React from 'react';
import {View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import {AppTextInput} from '../../components';
import {saveCategory, updateCategory} from '../../database/helpers';
import {Category} from '../../database/models';

const AddCategory = ({
  visible,
  category,
  hideModal,
  cancelEdit,
}: {
  visible: boolean;
  category: Category | undefined;
  hideModal: () => void;
  cancelEdit: () => void;
}) => {
  const [name, setName] = React.useState<string>('');
  const [color, setColor] = React.useState<string>(randomColor());
  const [errors, setErrors] = React.useState<{name: string | undefined}>({
    name: undefined,
  });

  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!name.length) {
      setErrors({...errors, name: 'Name is required'});
    } else {
      if (category) await updateCategory(category, {name, color});
      else await saveCategory({name, color});
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
          <Card.Title title="Add New Category" />
          <Card.Content style={{marginBottom: 20}}>
            <AppTextInput
              placeholder="Enter category name"
              value={name}
              onChangeText={text => setName(text)}
              onSubmitEditing={handleSubmit}
              error={errors.name}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  marginRight: 10,
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  backgroundColor: color,
                }}
              />
              <AppTextInput
                value={color}
                onChangeText={text =>
                  text.length < 1 ? setColor(randomColor()) : setColor(text)
                }
                style={{flex: 1}}
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

export {AddCategory};
