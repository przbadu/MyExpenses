import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList} from 'react-native';
import {Appbar} from 'react-native-paper';
import {CategoryRow} from '../../components';
import {observeCategories} from '../../database/helpers';
import {Category} from '../../database/models';

let ListCategories = ({
  navigation,
  categories,
}: {
  navigation: any;
  categories: Category[];
}) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="EXPENSE STATS" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <FlatList
        data={categories}
        keyExtractor={item => `category-${item.id}`}
        renderItem={({item}) => (
          <CategoryRow category={item} onPress={() => {}} />
        )}
      />
    </>
  );
};

ListCategories = withObservables([], () => ({
  categories: observeCategories(),
}));

export {ListCategories};
