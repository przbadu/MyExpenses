import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {currencies} from '../../constants';

interface CurrencyListProps {
  onSelect: Function;
}
const CurrencyList: React.FC<CurrencyListProps> = ({onSelect}) => {
  const renderItem = ({item}: {item: {isoCode: string; name: string}}) => (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
      }}>
      <Text>{item.name}</Text>
      <Text>{item.isoCode}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={currencies}
      renderItem={renderItem}
      keyExtractor={item => String(item.isoCode)}
      style={{paddingLeft: 20, paddingRight: 20}}
    />
  );
};

export {CurrencyList};
