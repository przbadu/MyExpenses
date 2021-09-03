import React from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {Appbar, Card, Button, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

import {
  SwitchButton,
  AppTextInput,
  AppSelect,
  AppModal,
  AppCalendarPickerInput,
} from '../../components';
import {
  CategoryProps,
  TransactionProps,
  TransactionTypeEnum,
  WalletProps,
} from '../../database/models';
import CategoryList from './CategoryList';
import WalletList from './WalletList';

const AddTransaction = () => {
  // prepare form state
  const [form, setForm] = React.useState<TransactionProps>({
    amount: 0.0,
    notes: '',
    transactionDateAt: new Date(),
    transactionType: TransactionTypeEnum.expense,
    isPaid: true,
    walletId: null,
    categoryId: null,
  });

  // Set category and wallet field text
  const [categoryText, setCategoryText] = React.useState<string | null>(null);
  const [walletText, setWalletText] = React.useState<string | null>(null);

  // show/hide category/wallet modal
  const [showCategoryModal, setShowCategoryModal] =
    React.useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = React.useState<boolean>(false);

  // Date time picker states
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [calendarMode, setCalendarMode] = React.useState<'date' | 'time'>(
    'date',
  );

  const isIncome = () => form.transactionType == TransactionTypeEnum.income;
  const isExpense = () => form.transactionType == TransactionTypeEnum.expense;

  const selectCategory = (item: CategoryProps) => {
    setCategoryText(item.name);
    setForm({...form, categoryId: item.id});
    setShowCategoryModal(false);
  };

  const selectWallet = (item: WalletProps) => {
    setWalletText(item.name);
    setForm({...form, walletId: item.id});
    setShowWalletModal(false);
  };

  const handleCalendarChange = (event: Event, date?: Date | any) => {
    const currentDate = date || form.transactionDateAt;
    setShowCalendar(Platform.OS == 'ios');
    setForm({...form, transactionDateAt: currentDate});
  };

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
          onPress={() => setShowCategoryModal(true)}
        />
        {showCategoryModal && (
          <AppModal
            visible={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
            heading="Select Category"
            renderContent={() => <CategoryList onSelect={selectCategory} />}
          />
        )}
      </>
    );
  }

  function renderWallet() {
    return (
      <>
        <AppSelect
          placeholder="Select Wallet"
          value={walletText}
          icon="bank"
          onPress={() => setShowWalletModal(true)}
        />
        {showWalletModal && (
          <AppModal
            visible={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            heading="Select Wallet"
            renderContent={() => <WalletList onSelect={selectWallet} />}
          />
        )}
      </>
    );
  }

  function renderDateTimePicker() {
    if (!showCalendar) return null;

    return (
      <DateTimePicker
        value={form.transactionDateAt}
        mode={calendarMode}
        is24Hour
        display="default"
        onChange={handleCalendarChange}
      />
    );
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
            <AppCalendarPickerInput
              date={dayjs(form.transactionDateAt).format('DD MMM YYYY')}
              time={dayjs(form.transactionDateAt).format('HH:mm')}
              icon="calendar"
              onChange={() => {}}
            />

            {renderCategory()}
            {renderWallet()}
            {renderDateTimePicker()}

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
