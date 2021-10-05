import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, TextInput, useTheme} from 'react-native-paper';
import {deleteCategory, observeCategories} from '../../database/helpers';
import {Category} from '../../database/models';
import {AppTextInput, ItemRow} from '../../components';
import {AddCategory} from '.';

let ListCategories = ({
  navigation,
  categories,
}: {
  navigation: any;
  categories: Category[];
}) => {
  const {colors} = useTheme();
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | undefined>();

  const handleDelete = async (category: Category) => {
    await deleteCategory(category);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Manage Categories'.toUpperCase()} />
        <Appbar.Action
          onPress={() => setShowModal(true)}
          icon="plus"
          style={{backgroundColor: colors.primary}}
        />
      </Appbar.Header>

      <View
        style={{
          flex: 1,
          marginTop: 20,
          marginHorizontal: 10,
          marginBottom: 60,
        }}>
        <FlatList
          data={categories}
          keyExtractor={item => `category-${item.id}`}
          renderItem={({item}: {item: Category}) => (
            <ItemRow
              item={item}
              onDelete={handleDelete}
              onEdit={() => {
                setEditing(item);
                setShowModal(true);
              }}
            />
          )}
        />
        <AddCategory
          hideModal={() => setShowModal(false)}
          visible={showModal}
          category={editing}
          cancelEdit={() => setEditing(undefined)}
        />
      </View>
    </>
  );
};

ListCategories = withObservables([], () => ({
  categories: observeCategories(),
}))(ListCategories);

export {ListCategories};
