import withObservables from '@nozbe/with-observables';
import React, {useContext} from 'react';
import {FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from 'react-native-paper';
import {AppColorPicker} from '../../components';
import {observeWallets} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {numberToCurrency, responsiveHeight} from '../../lib';
import {CurrencyContext} from '../../store/context';

interface WalletListProps {
  onSelect: (item: Wallet) => void;
  wallets: Wallet[];
}
const WalletList: React.FC<WalletListProps> = ({onSelect, wallets}) => {
  const {currency} = useContext(CurrencyContext);

  const renderItem = ({item}: {item: Wallet}) => (
    <TouchableWithoutFeedback onPress={() => onSelect(item)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', maxWidth: '40%'}}>
          <AppColorPicker
            icon={item.icon}
            color={item.color!}
            onPress={() => onSelect(item)}
          />
          <Text>{item.name}</Text>
        </View>
        <View style={{maxWidth: '60%'}}>
          <Text>{numberToCurrency(Number(item.balanceAmount), currency)}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={wallets}
      renderItem={renderItem}
      keyExtractor={(item: Wallet) => String(item.id)}
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
  wallets: observeWallets(),
}));

export default enhance(WalletList);
