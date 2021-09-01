import React from 'react';
import {
  View,
  TouchableOpacity,
  GestureResponderEvent,
  FlatList,
} from 'react-native';
import {List, Text} from 'react-native-paper';

const data = [
  {id: 1, title: 'item'},
  {id: 2, title: 'item'},
  {id: 3, title: 'item'},
  {id: 4, title: 'item'},
  {id: 5, title: 'item'},
  {id: 6, title: 'item'},
  {id: 7, title: 'item'},
  {id: 8, title: 'item'},
  {id: 9, title: 'item'},
  {id: 10, title: 'item'},
  {id: 11, title: 'item'},
  {id: 12, title: 'item'},
  {id: 13, title: 'item'},
  {id: 14, title: 'item'},
  {id: 15, title: 'item'},
  {id: 17, title: 'item'},
  {id: 16, title: 'item'},
];

interface ItemProps {
  item: {
    id: number;
    title: string;
  };
}

interface CategoryListProps {
  onSelect: (event: GestureResponderEvent) => void;
}
const CategoryList: React.FC<CategoryListProps> = ({onSelect}) => {
  const renderItem: React.FC<ItemProps> = ({item}) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
};

export {CategoryList};
