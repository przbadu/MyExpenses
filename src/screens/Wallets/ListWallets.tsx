import withObservables, {ObservableifyProps} from '@nozbe/with-observables';
import React from 'react';
import {FlatList} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {ItemRow} from '../../components';
import {deleteWallet, observeWallets} from '../../database/helpers';
import {Wallet} from '../../database/models';

interface Props {
  route: any;
  navigation: any;
  wallets: Wallet[];
}

let ListWallets: React.FC<Props> = ({wallets, navigation}) => {
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

type InputProps = ObservableifyProps<Props, 'route'>;
ListWallets = withObservables(['route'], ({route}: InputProps) => ({
  wallets: observeWallets(),
}))(ListWallets);

export {ListWallets};
