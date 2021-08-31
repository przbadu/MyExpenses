import React from 'react';
import {Appbar, Card, Text} from 'react-native-paper';

const Saving = () => {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="SAVING" />
      </Appbar.Header>

      <Card style={{marginVertical: 10}}>
        <Card.Content>
          <Text>Saving Screen</Text>
        </Card.Content>
      </Card>
    </>
  );
};

export {Saving};
