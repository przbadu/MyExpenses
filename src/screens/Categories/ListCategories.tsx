import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/core';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {AddCategory} from '.';
import {ItemRow} from '../../components';
import {deleteCategory, observeCategories} from '../../database/helpers';
import {Category} from '../../database/models';
import {responsiveHeight} from '../../lib';

let ListCategories = ({
  navigation,
  categories,
  route,
}: {
  navigation: any;
  categories: Category[];
  route: any;
}) => {
  const {colors} = useTheme();
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | undefined>();

  const handleDelete = async (category: Category) => {
    await deleteCategory(category);
    navigation.setParams({add: false});
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params) {
        const _add = route.params.add;
        setShowModal(_add);
      }
    }, []),
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() =>
            navigation.navigate('MainSettings', {screen: 'Settings'})
          }
        />
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
          marginBottom: responsiveHeight(11),
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
