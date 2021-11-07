import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/core';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {ItemRow} from '../../components';
import {
  deleteWallet,
  observeWallets,
  walletsWithAmount,
} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {responsiveHeight} from '../../lib';

let ListWallets = ({
  navigation,
  wallets,
}: {
  navigation: any;
  wallets: Wallet[];
}) => {
  const {colors} = useTheme();

  const handleDelete = async (wallet: Wallet) => {
    await deleteWallet(wallet);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Manage Wallets'.toUpperCase()} />
        <Appbar.Action
          onPress={() => navigation.navigate('AddWallet')}
          icon="plus"
          style={{backgroundColor: colors.primary}}
        />
      </Appbar.Header>

      <FlatList
        data={wallets}
        keyExtractor={item => `wallet-${item.id}`}
        renderItem={({item}: {item: Wallet}) => (
          <ItemRow
            item={item}
            onDelete={() => handleDelete(item)}
            onEdit={() => navigation.navigate('EditWallet', {id: item.id})}
            isWallet
          />
        )}
      />
    </>
  );
};

ListWallets = withObservables(['route'], ({route}) => ({
  wallets: observeWallets(),
}))(ListWallets);

export {ListWallets};
