import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {AddWallet} from '.';
import {ItemRow} from '../../components';
import {deleteWallet, walletsWithAmount} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {responsiveHeight} from '../../lib';

let ListWallets = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();
  const [wallets, setWallets] = React.useState<Wallet[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState<Wallet | undefined>();
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    fetchWallets();
  }, []);

  React.useEffect(() => {
    if (submitted) fetchWallets();
  }, [submitted]);

  const handleDelete = async (wallet: Wallet | undefined) => {
    if (wallet) {
      await deleteWallet(wallet);
      setSubmitted(true);
      setEditing(undefined);
      setShowModal(false);
    }
  };

  async function fetchWallets() {
    const _wallets = await walletsWithAmount();
    setWallets(_wallets);
    setSubmitted(false);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Manage Wallets'.toUpperCase()} />
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
          marginBottom: responsiveHeight(11),
        }}>
        <FlatList
          data={wallets}
          keyExtractor={item => `wallet-${item.id}`}
          renderItem={({item}: {item: Wallet}) => (
            <ItemRow
              item={item}
              onDelete={() => handleDelete(item)}
              onEdit={() => {
                setEditing(item);
                setShowModal(true);
              }}
              isWallet
            />
          )}
        />
        <AddWallet
          hideModal={() => setShowModal(false)}
          visible={showModal}
          wallet={editing}
          cancelEdit={() => setEditing(undefined)}
          onSubmitted={() => setSubmitted(true)}
          handleDelete={handleDelete}
        />
      </View>
    </>
  );
};

export {ListWallets};
