import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {observeWallets} from '../../database/helpers';
import {WalletProps} from '../../database/models';
import {responsiveHeight} from '../../lib';

interface WalletListProps {
  onSelect: (item: WalletProps) => void;
  wallets: WalletProps[];
}
const WalletList: React.FC<WalletListProps> = ({onSelect, wallets}) => {
  const renderItem = ({item}: {item: WalletProps}) => (
    <TouchableWithoutFeedback onPress={() => onSelect(item)}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar.Text
          label=""
          size={18}
          style={{marginRight: 10, backgroundColor: item.color}}
        />
        <Text style={{marginBottom: 10, marginTop: 10}}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={wallets}
      renderItem={renderItem}
      keyExtractor={(item: WalletProps) => String(item.id)}
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
