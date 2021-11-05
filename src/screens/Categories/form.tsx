import React from 'react';
import {View} from 'react-native';
import {Button, Card, TextInput} from 'react-native-paper';
import {AppTextInput} from '../../components';
import {saveCategory, updateCategory} from '../../database/helpers';
import {Category} from '../../database/models';
import {generateColor} from '../../lib';

const Form = ({
  navigation,
  category,
}: {
  navigation: any;
  category?: Category | undefined;
}) => {
  const [name, setName] = React.useState<string>('');
  const [color, setColor] = React.useState<string>(generateColor());
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
      setName('');
      resetColor();
      setErrors({name: undefined});
      goBack();
    }
  };

  const goBack = () =>
    navigation.navigate('ListCategories', {id: category?.id});

  function resetColor() {
    setColor(generateColor());
  }

  return (
    <Card style={{marginTop: 10}}>
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
        <Button onPress={goBack} mode="outlined">
          Cancel
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default Form;
