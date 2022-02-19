import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  Button,
  Card,
  Colors,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';

import AppTextInput from '../../components/AppTextInput';
import AppColorPicker from '../../components/AppColorPicker';
import {saveCategory, updateCategory} from '../../../data/helpers';
import {Category} from '../../../data/models';
import {categoryIcons, generateColors, responsiveHeight} from '../../../lib';

const Form = ({
  navigation,
  category,
}: {
  navigation: any;
  category?: Category | undefined;
}) => {
  let initialColors: string[] = generateColors();
  const {colors} = useTheme();
  const [randomColors, setRandomColors] =
    React.useState<string[]>(initialColors);
  const [name, setName] = React.useState<string>('');
  const [color, setColor] = React.useState<string>(initialColors[0]);
  const [icon, setIcon] = React.useState<string>('shape');
  const [errors, setErrors] = React.useState<{name: string | undefined}>({
    name: undefined,
  });

  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setIcon(category.icon);
      setRandomColors([...randomColors, category.color]);
    }

    return () => {};
  }, [category]);

  const handleSubmit = async () => {
    if (!name.length) {
      setErrors({...errors, name: 'Name is required'});
    } else {
      if (category) await updateCategory(category, {name, color, icon});
      else await saveCategory({name, color, icon});
      setName('');
      setIcon('shape');
      setErrors({name: undefined});
      goBack();
    }
  };

  const goBack = () =>
    navigation.navigate('ListCategories', {id: category?.id});

  function resetColor() {
    const _colors = generateColors();
    setRandomColors(_colors);
  }

  return (
    <ScrollView>
      <Card>
        <Card.Content style={{marginBottom: 20}}>
          <AppTextInput
            placeholder="Enter category name"
            value={name}
            onChangeText={text => setName(text)}
            onSubmitEditing={handleSubmit}
            error={errors.name}
          />

          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text>Choose a color</Text>
              <IconButton
                icon="refresh"
                color={colors.primary}
                onPress={resetColor}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
                flex: 1,
              }}>
              {randomColors.map(c => (
                <AppColorPicker
                  key={c}
                  selected={color === c}
                  color={c}
                  onPress={() => setColor(c)}
                  containerStyles={{marginBottom: 10}}
                />
              ))}
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <Text>Choose an icon</Text>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
              {categoryIcons.map(i => (
                <AppColorPicker
                  key={i}
                  color={
                    icon === i ? color || colors.background : Colors.grey800
                  }
                  icon={i}
                  onPress={() => setIcon(i)}
                  containerStyles={{marginBottom: 10}}
                />
              ))}
            </View>
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
    </ScrollView>
  );
};

export default Form;
