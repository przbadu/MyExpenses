import React from 'react';
import {Appbar} from 'react-native-paper';
import {Form} from './form';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type Props = NativeStackNavigationProp<RootStackParamList, 'AddWallet'>;

const AddWallet = () => {
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Add New Wallets'.toUpperCase()} />
      </Appbar.Header>

      <Form navigation={navigation} />
    </>
  );
};

export {AddWallet};
