import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import {Appbar, Card, Button, TextInput} from 'react-native-paper';
import dayjs from 'dayjs';

import {
  SwitchButton,
  AppTextInput,
  AppSelect,
  AppDatePicker,
  AppTimePicker,
  SwitchButtonContent,
} from '../../components';
import CategoryList from './CategoryList';
import WalletList from './WalletList';
import {useForm} from './useForm';
import {styles} from './styles';
import {DefaultDateFormat, DefaultTimeFormat} from '../../constants';
import {
  CategoryProps,
  Transaction,
  TransactionProps,
  TransactionTypeEnum,
  WalletProps,
} from '../../database/models';
import {transactions} from '../../database/helpers';

const AddTransaction = ({navigation, route}) => {
  const transactionId = route?.params?.transactionId;
  // useful for editing a form
  const {
    submitting,
    form,
    errors,
    handleFormChange,
    handleSubmit,
    resetForm,
    resetErrors,
  } = useForm(transactionId);
  const [categoryText, setCategoryText] = useState<string | null>(null);
  const [walletText, setWalletText] = useState<string | null>(null);

  // show/hide category/wallet modal
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

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

  // before leaving screen
  useFocusEffect(
    React.useCallback(() => {
      // things todo on add transaction focused event
      return () => {
        // things to do on add transaction blur event
        console.log('loosing focus');
        navigation.setParams({transactionId: null});
        resetForm();
        resetErrors();
        setWalletText(null);
        setCategoryText(null);
      };
    }, []),
  );

  // Fetch transaction and set default form data
  useEffect(() => {
    if (transactionId) setEditFormContent();
  }, [transactionId]);

  const setEditFormContent = async () => {
    const _transaction: TransactionProps = (await transactions.find(
      transactionId,
    )) as Transaction;
    const {amount, notes, transactionAt, time, transactionType, isPaid} =
      _transaction;
    const _wallet = await _transaction.wallet;
    const _category = await _transaction.category;

    handleFormChange({
      ...form,
      amount,
      notes,
      transactionAt,
      transactionType,
      isPaid,
      time,
      walletId: _wallet.id,
      categoryId: _category.id,
    });
    setWalletText(_wallet.name);
    setCategoryText(_category.name);
  };

  function toggleTransactonType() {
    let type = TransactionTypeEnum.income;
    if (form.transactionType == TransactionTypeEnum.income)
      type = TransactionTypeEnum.expense;

    handleFormChange({...form, transactionType: type});
  }

  function renderIncomeExpenseSwitch() {
    return (
      <SwitchButton
        onPress={toggleTransactonType}
        containerStyles={{marginBottom: 10}}>
        <SwitchButtonContent
          icon="cash-minus"
          label="Expense"
          active={form.transactionType == TransactionTypeEnum.expense}
        />
        <SwitchButtonContent
          icon="cash-plus"
          label="Income"
          active={form.transactionType == TransactionTypeEnum.income}
        />
      </SwitchButton>
    );
  }

  function renderTransactionDateTime() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1.8, marginRight: 5}}>
          <AppDatePicker
            label="Date"
            showSoftInputOnFocus={false}
            value={dayjs(form.transactionAt).format(DefaultDateFormat)}
            date={form.transactionAt}
            onConfirm={(date: Date) =>
              handleFormChange({
                ...form,
                transactionAt: date || form.transactionAt,
              })
            }
          />
        </View>
        <View style={{flex: 1}}>
          <AppTimePicker
            label="Time"
            showSoftInputOnFocus={false}
            value={form.time}
            onConfirm={(date: Date) =>
              handleFormChange({
                ...form,
                time: dayjs(date).format(DefaultTimeFormat),
              })
            }
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="ADD TRANSACTION" />
      </Appbar.Header>
      <ScrollView keyboardShouldPersistTaps="handled">
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
