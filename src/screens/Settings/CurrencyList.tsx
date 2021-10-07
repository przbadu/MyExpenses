import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {currencies, responsiveHeight} from '../../constants';

const CurrencyList: React.FC<{currency: string; onSelect: Function}> = ({
  onSelect,
  currency,
}) => {
  let currencyRef = React.useRef();

  React.useEffect(() => {
    scrollToIndex();
  }, [currency]);

  function scrollToIndex() {
    let index = currencies.findIndex(c => c.isoCode === currency);

    currencyRef?.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  }

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
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: responsiveHeight(10),
      }}
      onScrollToIndexFailed={info => {
        // scrollToIndex();
      }}
    />
  );
};

export {CurrencyList};
