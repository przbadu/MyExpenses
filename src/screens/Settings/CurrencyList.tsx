import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {currencies} from '../../constants';

interface CurrencyListProps {
  currency: string;
  onSelect: Function;
}
const CurrencyList: React.FC<CurrencyListProps> = ({onSelect, currency}) => {
  let currencyRef = React.useRef();

  React.useEffect(() => {
    console.log('currency changed', currency);
    scrollToIndex();
  }, [currency]);

  function scrollToIndex() {
    let index = currencies.findIndex(c => c.isoCode === currency);
    console.log(index);

    currencyRef?.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  }

  // method to find selected currency index

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
      ref={currencyRef}
      data={currencies}
      renderItem={renderItem}
      keyExtractor={item => String(item.isoCode)}
      style={{paddingLeft: 20, paddingRight: 20}}
      onScrollToIndexFailed={info => {
        console.log(info);
        // scrollToIndex();
      }}
    />
  );
};

export {CurrencyList};
