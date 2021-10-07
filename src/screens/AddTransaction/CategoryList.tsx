import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {responsiveHeight} from '../../constants';
import {observeCategories} from '../../database/helpers';
import {CategoryProps} from '../../database/models';

interface CategoryListProps {
  onSelect: (item: CategoryProps) => void;
  categories: CategoryProps[];
}
const CategoryList: React.FC<CategoryListProps> = ({onSelect, categories}) => {
  const renderItem = ({item}: {item: CategoryProps}) => (
    <TouchableOpacity onPress={() => onSelect(item)}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar.Text
          label=""
          size={18}
          style={{marginRight: 10, backgroundColor: item.color}}
        />
        <Text style={{marginBottom: 10, marginTop: 10}}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item: CategoryProps) => String(item.id)}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: responsiveHeight(20),
      }}
      disableScrollViewPanResponder
    />
  );
};

const enhance = withObservables([], () => ({
  categories: observeCategories(),
}));

export default enhance(CategoryList);
