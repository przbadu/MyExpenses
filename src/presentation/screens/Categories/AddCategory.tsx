import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';
import Form from './form';

const AddCategory = ({navigation}) => {
  const {colors} = useTheme();
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.navigate('ListCategories')}
        />
        <Appbar.Content title={'New Category'.toUpperCase()} />
      </Appbar.Header>

      <Form navigation={navigation} />
    </>
  );
};

export {AddCategory};
