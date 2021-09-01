import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Appbar, Card, Button, TextInput} from 'react-native-paper';

import {SwitchButton, AppTextInput, AppSelect, AppModal} from '../components';
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
  const [categoryText, setCategoryText] = React.useState(null);
  const [walletText, setWalletText] = React.useState(null);
  const [showCategoryModal, setShowCategoryModal] = React.useState(true);
  const [showWalletModal, setShowWalletModal] = React.useState(false);

  const isIncome = () => form.transactionType == TransactionTypeEnum.income;
  const isExpense = () => form.transactionType == TransactionTypeEnum.expense;

  function renderIncomeExpenseSwitch() {
    return (
      <View style={styles.incomeExpenseContainer}>
        <SwitchButton
          onPress={() =>
            setForm({...form, transactionType: TransactionTypeEnum.expense})
          }
          label="Expense"
          isActive={isExpense()}
          icon={isExpense() ? 'minus' : undefined}
          containerStyles={{borderWidth: 0, borderBottomWidth: 1}}
        />
        <SwitchButton
          onPress={() =>
            setForm({...form, transactionType: TransactionTypeEnum.income})
          }
          label="Income"
          isActive={isIncome()}
          icon={isIncome() ? 'plus' : undefined}
          containerStyles={{
            marginLeft: 10,
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
        />
      </View>
    );
  }

  function renderCategory() {
    return (
      <>
        <AppSelect
          placeholder="Select Category"
          value={categoryText}
          icon="format-list-bulleted"
          onPress={() => {}}
        />
        {showCategoryModal && (
          <AppModal
            show={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
          />
        )}
      </>
    );
  }

  function renderWallet() {
    <>
      <AppSelect
        placeholder="Select Wallet  "
        value={categoryText}
        icon="format-list-bulleted"
        onPress={() => {}}
      />
    </>;
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="ADD TRANSACTION" />
      </Appbar.Header>
      <ScrollView>
        <Card style={styles.container}>
          <Card.Content>
            {renderIncomeExpenseSwitch()}
            <AppTextInput
              mode="flat"
              label="Amount"
              placeholder="0.00"
              keyboardType="number-pad"
              left={<TextInput.Icon name="currency-usd" />}
              style={styles.input}
            />
            <AppTextInput
              label="Notes"
              placeholder="0.00"
              value={form.notes}
              onChangeText={text => setForm({...form, notes: text})}
              right={<TextInput.Affix text={`${form.notes.length}/255`} />}
              left={<TextInput.Icon name="calendar-text" />}
              style={styles.input}
            />
            <AppTextInput
              label="Date"
              value={form.transactionDateAt?.toString()}
              left={<TextInput.Icon name="calendar" />}
              style={styles.input}
            />

            {renderCategory()}
            {renderWallet()}

            <Button
              icon="database-plus"
              mode="contained"
              onPress={() => {}}
              style={{marginTop: 20, marginBottom: 10, padding: 10}}>
              SAVE
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  input: {
    marginBottom: 15,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
  },
});

export {AddTransaction};
