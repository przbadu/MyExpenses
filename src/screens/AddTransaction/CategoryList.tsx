import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {AppColorPicker} from '../../components';
import {observeCategories} from '../../database/helpers';
import {CategoryProps} from '../../database/models';
import {responsiveHeight, responsiveWidth} from '../../lib';

interface CategoryListProps {
  onSelect: (item: CategoryProps) => void;
  categories: CategoryProps[];
}
const CategoryList: React.FC<CategoryListProps> = ({onSelect, categories}) => {
  const renderItem = ({item}: {item: CategoryProps}) => (
    <TouchableWithoutFeedback onPress={() => onSelect(item)}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
        <AppColorPicker icon={item.icon} color={item.color!} />
        <Text style={{marginBottom: 10, marginTop: 10}}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
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
