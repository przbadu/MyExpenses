import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, TextInput, Card, Button} from 'react-native-paper';
import {TransactionProps, TransactionTypeEnum} from '../database/models';

const AddTransaction = () => {
  const [form, setForm] = React.useState<TransactionProps>({
    amount: 0.0,
    notes: '',
    transactionDateAt: new Date(),
    transactionType: TransactionTypeEnum.expense,
    isPaid: true,
    walletId: null,
    categoryId: null,
  });

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="ADD TRANSACTION" />
      </Appbar.Header>
      <Card style={styles.container}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Amount"
            placeholder="0.00"
            keyboardType="number-pad"
            left={<TextInput.Icon name="currency-usd" />}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Notes"
            placeholder="0.00"
            value={form.notes}
            onChangeText={text => setForm({...form, notes: text})}
            right={<TextInput.Affix text={`/${255 - form.notes.length}`} />}
            left={<TextInput.Icon name="calendar-text" />}
            style={styles.input}
          />
          <Button
            icon="database-plus"
            mode="contained"
            onPress={() => {}}
            style={{marginTop: 20, padding: 10}}>
            SAVE
          </Button>
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
});

export {AddTransaction};
