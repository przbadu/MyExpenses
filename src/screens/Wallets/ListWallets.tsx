import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {observeWallets} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {ItemRow} from '../../components';

let ListWallets = ({
  navigation,
  wallets,
}: {
  navigation: any;
  wallets: Wallet[];
}) => {
  const handleDelete = async (wallet: Wallet) => {
    await wallet.destroyPermanently();
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'EXPENSE STATS'.toUpperCase()} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <View
        style={{
          flex: 1,
          marginTop: 20,
          marginHorizontal: 10,
          marginBottom: 60,
        }}>
        <FlatList
          data={wallets}
          keyExtractor={item => `wallet-${item.id}`}
          renderItem={({item}: {item: Wallet}) => (
            <ItemRow item={item} onDelete={handleDelete} />
          )}
        />
      </View>
    </>
  );
};

ListWallets = withObservables([], () => ({
  wallets: observeWallets(),
}))(ListWallets);

export {ListWallets};
