import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from 'react-native-paper';
import {AppColorPicker} from '../../components';
import {observeCategories} from '../../database/helpers';
import {Category} from '../../database/models';
import {responsiveHeight} from '../../lib';

interface CategoryListProps {
  onSelect: (item: Category) => void;
  categories: Category[];
}
let CategoryList: React.FC<CategoryListProps> = ({onSelect, categories}) => {
  const renderItem = ({item}: {item: Category}) => (
    <TouchableWithoutFeedback onPress={() => onSelect(item)}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
        <AppColorPicker
          icon={item.icon}
          color={item.color!}
          onPress={() => onSelect(item)}
        />
        <Text style={{marginBottom: 10, marginTop: 10}}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item: Category) => String(item.id)}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: responsiveHeight(20),
      }}
      disableScrollViewPanResponder
    />
  );
};

CategoryList = withObservables([], () => ({
  categories: observeCategories(),
}))(CategoryList);

export default CategoryList;
