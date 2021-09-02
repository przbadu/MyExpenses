import React from 'react';
import {View, TouchableOpacity, FlatList, Platform} from 'react-native';
import {Text} from 'react-native-paper';
import withObservables from '@nozbe/with-observables';

import {CategoryProps} from '../../database/models';
import {observeCategories} from '../../database/helpers';
import {categoryColors} from '../../constants';

interface CategoryListProps {
  onSelect: (item: CategoryProps) => void;
  categories: CategoryProps[];
}
const CategoryList: React.FC<CategoryListProps> = ({onSelect, categories}) => {
  const renderItem = ({item}: {item: CategoryProps}) => (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      onPress={() => onSelect(item)}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 24,
          backgroundColor:
            categoryColors[Math.floor(Math.random() * categoryColors.length)],
          marginRight: 10,
        }}
      />
      <Text style={{marginBottom: 10, marginTop: 10}}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item: CategoryProps) => String(item.id)}
      style={{paddingLeft: 20, paddingRight: 20}}
    />
  );
};

const enhance = withObservables([], () => ({
  categories: observeCategories(),
}));

export default enhance(CategoryList);
