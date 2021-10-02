import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';

const ListWallets = ({navigation}) => {
  return (
    <View>
      <Text>lit of wallets</Text>
      <Button onPress={() => navigation.navigate('AddWallet')}>
        Add category
      </Button>
    </View>
  );
};

export {ListWallets};
