import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';

const AddWallet = ({navigation}) => {
  return (
    <View>
      <Text>Add Wallet</Text>
      <Button onPress={() => navigation.navigate('ListWallets')}>
        Go Back
      </Button>
    </View>
  );
};

export {AddWallet};
