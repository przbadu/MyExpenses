import withObservables from '@nozbe/with-observables';
import React from 'react';
import {Appbar} from 'react-native-paper';
import {wallets} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {Form} from './form';

let EditWallet = ({wallet, navigation}: {wallet: Wallet; navigation: any}) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Manage Wallets'.toUpperCase()} />
      </Appbar.Header>

      <Form navigation={navigation} wallet={wallet} />
    </>
  );
};

EditWallet = withObservables(['route'], ({route}) => ({
  wallet: wallets.findAndObserve(route?.params?.id),
}))(EditWallet);

export {EditWallet};
