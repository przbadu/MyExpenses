import React from 'react';
import {Card, Appbar, Text} from 'react-native-paper';

const Transactions = () => {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="TRANSACTIONS" />
      </Appbar.Header>

      <Card style={{marginVertical: 10}}>
        <Card.Content>
          <Text>Transaction List</Text>
        </Card.Content>
      </Card>
    </>
  );
};

export {Transactions};
