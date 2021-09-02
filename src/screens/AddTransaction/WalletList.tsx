import React from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {Text} from 'react-native-paper';
import withObservables from '@nozbe/with-observables';

import {WalletProps} from '../../database/models';
import {observeWallets} from '../../database/helpers';

interface WalletListProps {
  onSelect: (item: WalletProps) => void;
  wallets: WalletProps[];
}
const WalletList: React.FC<WalletListProps> = ({onSelect, wallets}) => {
  const renderItem = ({item}: {item: WalletProps}) => (
    <TouchableOpacity onPress={() => onSelect(item)}>
      <Text style={{marginBottom: 10, marginTop: 10}}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={wallets}
      renderItem={renderItem}
      keyExtractor={(item: WalletProps) => String(item.id)}
      style={{paddingLeft: 20, paddingRight: 20}}
    />
  );
};

const enhance = withObservables([], () => ({
  wallets: observeWallets(),
}));

export default enhance(WalletList);
