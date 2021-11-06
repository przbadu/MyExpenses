import {useFocusEffect} from '@react-navigation/core';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {ItemRow} from '../../components';
import {deleteWallet, walletsWithAmount} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {responsiveHeight} from '../../lib';

let ListWallets = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();
  const [wallets, setWallets] = React.useState<Wallet[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchWallets();
    }, []),
  );

  const handleDelete = async (wallet: Wallet) => {
    await deleteWallet(wallet);
    await fetchWallets();
  };

  async function fetchWallets() {
    const _wallets = await walletsWithAmount();
    setWallets(_wallets);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() =>
            navigation.navigate('MainSettings', {screen: 'Settings'})
          }
        />
        <Appbar.Content title={'Manage Wallets'.toUpperCase()} />
        <Appbar.Action
          onPress={() => navigation.navigate('AddWallet')}
          icon="plus"
          style={{backgroundColor: colors.primary}}
        />
      </Appbar.Header>

      <View
        style={{
          flex: 1,
          marginTop: 20,
          marginHorizontal: 10,
          marginBottom: responsiveHeight(11),
        }}>
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
      </View>
    </>
  );
};

export {ListWallets};
