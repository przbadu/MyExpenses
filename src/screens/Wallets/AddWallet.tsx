import React from 'react';
import {Appbar} from 'react-native-paper';
import {Form} from './form';

const AddWallet = ({navigation}: {navigation: any}) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() =>
            navigation.navigate('MainSettings', {screen: 'Settings'})
          }
        />
        <Appbar.Content title={'Add New Wallets'.toUpperCase()} />
      </Appbar.Header>

      <Form navigation={navigation} />
    </>
  );
};

export {AddWallet};
