import withObservables from '@nozbe/with-observables';
import React from 'react';
import {Appbar} from 'react-native-paper';
import {categories} from '../../database/helpers';
import {Category} from '../../database/models';
import Form from './form';

let EditCategory = ({
  category,
  navigation,
  route,
}: {
  navigation: any;
  route: any;
  category: Category;
}) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.navigate('ListCategories')}
        />
        <Appbar.Content title={`Editing: ${category?.name}`.toUpperCase()} />
      </Appbar.Header>
      <Form navigation={navigation} category={category} />
    </>
  );
};

EditCategory = withObservables(['route'], ({route}) => ({
  category: categories.findAndObserve(route?.params?.id),
}))(EditCategory);

export {EditCategory};
