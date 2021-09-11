import React from 'react';
import {View, ScrollView} from 'react-native';
import {Appbar, Card, Button, TextInput} from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

// components
import {
  SwitchButton,
  AppTextInput,
  AppSelect,
  AppModal,
  AppCalendarPickerInput,
} from '../../components';
import CategoryList from './CategoryList';
import WalletList from './WalletList';

// database
import {
  CategoryProps,
  TransactionProps,
  TransactionTypeEnum,
  WalletProps,
} from '../../database/models';
import {saveTransaction} from '../../database/helpers';

import {styles} from './styles';

const now = new Date();
const dateFormat = 'DD MMM YYYY';
const initialFormState = {
  amount: 0,
  notes: '',
  transactionAt: now,
  time: dayjs(now).format('HH:mm'),
  transactionType: TransactionTypeEnum.expense,
  isPaid: true,
  walletId: null,
  categoryId: null,
};
const AddTransaction = ({navigation}) => {
  // prepare form state
  const [amountError, setAmountError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [form, setForm] = React.useState<TransactionProps>(initialFormState);

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

  const submitForm = () => {
    setSubmitting(true);
    // normal validations
    if (form.amount === 0) {
      setAmountError('Please enter amount');
      setSubmitting(false);
      return;
    }

    setAmountError(null);
    saveTransaction({...form});
    setForm({...form, ...initialFormState});
    setSubmitting(false);
    navigation.navigate('Transactions');
  };

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

  const handleCalendarChange = (date: Date) => {
    if (calendarMode == 'date') {
      setForm({...form, transactionAt: date || form.transactionAt});
    } else if (calendarMode == 'time') {
      setForm({...form, time: dayjs(date).format('HH:mm')});
    }
    setShowCalendar(false);
  };

  const showDatePicker = () => {
    setShowCalendar(true);
    setCalendarMode('date');
  };

  const showTimePicker = () => {
    setShowCalendar(true);
    setCalendarMode('time');
  };
  // END state and helper methods

  // User Interface
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
          onPress={() => {
            setForm({
              ...form,
              transactionType: TransactionTypeEnum.income,
              categoryId: null,
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

  function renderTransactionDateTime() {
    return (
      <>
        {/* Date and time picker input */}
        <AppCalendarPickerInput
          date={dayjs(form.transactionAt).format(dateFormat)}
          time={form.time}
          icon="calendar"
          onShowDatePicker={showDatePicker}
          onShowTimePicker={showTimePicker}
        />
        <DateTimePicker
          isVisible={showCalendar}
          mode={calendarMode}
          display="default"
          onConfirm={handleCalendarChange}
          onCancel={() => setShowCalendar(false)}
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
              mode="flat"
              label="Amount"
              placeholder="0.00"
              value={String(form.amount)}
              onChangeText={text => {
                console.log('text', text);
                setForm({...form, amount: text});
              }}
              keyboardType="decimal-pad"
              selectTextOnFocus
              left={<TextInput.Icon name="currency-usd" />}
              error={amountError !== null}
              errorMessage={amountError}
              style={styles.input}
            />
            <AppTextInput
              label="Notes"
              placeholder="Enter your notes"
              maxLength={255}
              value={form.notes}
              onChangeText={text => setForm({...form, notes: text})}
              right={<TextInput.Affix text={`${form.notes.length}/255`} />}
              left={<TextInput.Icon name="calendar-text" />}
              style={styles.input}
            />

            {renderTransactionDateTime()}
            {isExpense() && renderCategory()}
            {renderWallet()}

            <Button
              icon="database-plus"
              mode="contained"
              onPress={submitForm}
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
