import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/core';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
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

  const handleDelete = async (category: Category) => {
    await deleteCategory(category);
    navigation.setParams({add: false});
  };

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
          onPress={() => navigation.navigate('AddCategory')}
          icon="plus"
          style={{backgroundColor: colors.primary}}
        />
      </Appbar.Header>

      <FlatList
        data={categories}
        keyExtractor={item => `category-${item.id}`}
        renderItem={({item}: {item: Category}) => (
          <ItemRow
            item={item}
            onDelete={handleDelete}
            onEdit={() => {
              navigation.navigate('EditCategory', {id: item.id});
            }}
          />
        )}
      />
    </>
  );
};

// TODO: refresh list when category is updated
ListCategories = withObservables(['route'], () => ({
  categories: observeCategories(),
}))(ListCategories);

export {ListCategories};
