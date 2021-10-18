import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, View} from 'react-native';
import {Appbar, Button, Caption, Surface, Text} from 'react-native-paper';
import {deleteSaving, observeSavings} from '../../database/helpers';
import {Saving} from '../../database/models';
import {responsiveHeight} from '../../lib';

let ListSavings = ({
  navigation,
  savings,
  route,
}: {
  navigation: any;
  savings: Saving[];
  route: any;
}) => {
  const handleDelete = async (saving: Saving) => {
    await deleteSaving(saving);
    navigation.setParams({add: false});
  };

  function renderEmptyList() {
    return (
      <Surface style={{padding: 20}}>
        <Caption style={{textAlign: 'center'}}>No result found</Caption>
        <Button onPress={() => navigation.navigate('AddSaving')}>
          Add your first saving!
        </Button>
      </Surface>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={'Savings'.toUpperCase()} />

        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate('AddSaving')}
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
          data={savings}
          keyExtractor={item => `saving-${item.id}`}
          renderItem={({item}: {item: Saving}) => (
            <Text key={item.id}>{item.title}</Text>
          )}
          ListEmptyComponent={renderEmptyList()}
        />
      </View>
    </>
  );
};

ListSavings = withObservables([], () => ({
  savings: observeSavings(),
}))(ListSavings);

export {ListSavings};
