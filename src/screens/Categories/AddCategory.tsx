import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';

const AddCategory = ({navigation}) => {
  return (
    <View>
      <Text>Add Category</Text>
      <Button onPress={() => navigation.navigate('ListCategories')}>
        Go Back
      </Button>
    </View>
  );
};

export {AddCategory};
