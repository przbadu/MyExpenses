import React from 'react';
import {View, ScrollView} from 'react-native';
import {Appbar, Card, Button, TextInput} from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

import {
  SwitchButton,
  AppTextInput,
  AppSelect,
  AppCalendarPickerInput,
} from '../../components';
import CategoryList from './CategoryList';
import WalletList from './WalletList';
import {useForm} from './useForm';
import {styles} from './styles';
import {DefaultDateFormat} from '../../constants';
import {
  CategoryProps,
  TransactionTypeEnum,
  WalletProps,
} from '../../database/models';
import AppDatePicker from '../../components/AppDatePicker';

const AddTransaction = () => {
  const {submitting, form, errors, handleFormChange, handleSubmit} = useForm();
  const [categoryText, setCategoryText] = React.useState<string | null>(null);
  const [walletText, setWalletText] = React.useState<string | null>(null);

  // show/hide category/wallet modal
  const [showCategoryModal, setShowCategoryModal] =
    React.useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = React.useState<boolean>(false);

  const isIncome = () => form.transactionType == TransactionTypeEnum.income;
  const isExpense = () => form.transactionType == TransactionTypeEnum.expense;

  const selectCategory = (item: CategoryProps) => {
    setCategoryText(item.name);
    handleFormChange({...form, categoryId: item.id});
    setShowCategoryModal(false);
  };
  const selectWallet = (item: WalletProps) => {
    setWalletText(item.name);
    handleFormChange({...form, walletId: item.id});
    setShowWalletModal(false);
  };

  const selectDate = (date: Date) => {
    handleFormChange({...form, transactionAt: date || form.transactionAt});
    // handleFormChange({...form, time: dayjs(date).format('HH:mm')});
  };
  console.log('at', form.transactionAt);
  // END state and helper methods

  // User Interface
  function renderIncomeExpenseSwitch() {
    return (
      <View style={styles.incomeExpenseContainer}>
        <SwitchButton
          onPress={() =>
            handleFormChange({
              ...form,
              transactionType: TransactionTypeEnum.expense,
            })
          }
          label="Expense"
          isActive={isExpense()}
          icon={isExpense() ? 'minus' : undefined}
          containerStyles={{borderWidth: 0, borderBottomWidth: 1}}
        />
        <SwitchButton
          onPress={() => {
            handleFormChange({
              ...form,
              transactionType: TransactionTypeEnum.income,
              categoryId: undefined,
            });
            setCategoryText(null);
          }}
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

  function renderTransactionDateTime() {
    return (
      <>
        {/* Date and time picker input */}
        <AppDatePicker
          label="Transaction Date"
          showSoftInputOnFocus={false}
          value={dayjs(form.transactionAt).format(DefaultDateFormat)}
          date={form.transactionAt}
          onConfirm={selectDate}
        />
      </>
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
              label="Amount"
              placeholder="0.00"
              value={String(form.amount)}
              onChangeText={text => {
                handleFormChange({...form, amount: text});
              }}
              keyboardType="decimal-pad"
              selectTextOnFocus
              left={<TextInput.Icon name="currency-usd" />}
              error={errors.amount}
            />
            <AppTextInput
              label="Notes"
              placeholder="Enter your notes"
              maxLength={255}
              value={form.notes}
              onChangeText={text => handleFormChange({...form, notes: text})}
              right={<TextInput.Affix text={`${form.notes.length}/255`} />}
              left={<TextInput.Icon name="calendar-text" />}
              error={errors.notes}
            />

            {renderTransactionDateTime()}
            {isExpense() && (
              <AppSelect
                placeholder="Select Category"
                value={categoryText!}
                error={errors.categoryId}
                left={<TextInput.Icon name="format-list-bulleted" />}
                open={showCategoryModal}
                onOpen={() => setShowCategoryModal(true)}
                onClose={() => setShowCategoryModal(false)}
                renderContent={() => <CategoryList onSelect={selectCategory} />}
              />
            )}

            <AppSelect
              placeholder="Select Wallet"
              value={walletText!}
              error={errors.walletId}
              open={showWalletModal}
              onOpen={() => setShowWalletModal(true)}
              onClose={() => setShowWalletModal(false)}
              left={<TextInput.Icon name="bank" />}
              renderContent={() => <WalletList onSelect={selectWallet} />}
            />

            <Button
              icon="database-plus"
              mode="contained"
              onPress={handleSubmit}
              disabled={submitting}
              style={{marginTop: 20, marginBottom: 10, padding: 10}}>
              {submitting ? 'please wait...' : 'SAVE'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

export {AddTransaction};
