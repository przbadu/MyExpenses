import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {deleteWallet, observeWallets} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {ItemRow} from '../../components';
import {AddWallet} from '.';

let ListWallets = ({
  navigation,
  wallets,
}: {
  navigation: any;
  wallets: Wallet[];
}) => {
  const {colors} = useTheme();
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState<Wallet | undefined>();

  const handleDelete = async (wallet: Wallet) => {
    await deleteWallet(wallet);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Manage Categories'.toUpperCase()} />
        <Appbar.Action
          onPress={() => setShowModal(true)}
          icon="plus"
          style={{backgroundColor: colors.primary}}
        />
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
            <ItemRow
              item={item}
              onDelete={handleDelete}
              onEdit={() => {
                setEditing(item);
                setShowModal(true);
              }}
            />
          )}
        />
        <AddWallet
          hideModal={() => setShowModal(false)}
          visible={showModal}
          wallet={editing}
          cancelEdit={() => setEditing(undefined)}
        />
      </View>
    </>
  );
};

ListWallets = withObservables([], () => ({
  wallets: observeWallets(),
}))(ListWallets);

export {ListWallets};
