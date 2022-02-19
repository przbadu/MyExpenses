import {useFocusEffect} from '@react-navigation/core';
import dayjs from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StatusBar, View} from 'react-native';
import {Appbar, Button, Card, TextInput, useTheme} from 'react-native-paper';

import AppDatePicker from '../../components/AppDatePicker';
import AppSelect from '../../components/AppSelect';
import AppTextInput from '../../components/AppTextInput';
import SwitchButton from '../../components/SwitchButton';
import SwitchButtonContent from '../../components/SwitchButtonContent';
import {DefaultDateFormat} from '../../../lib';
import {transactions} from '../../../data/helpers';
import {
  Category,
  Transaction,
  TransactionTypeEnum,
  Wallet,
} from '../../../data/models';
import CategoryList from './components/CategoryList';
import {styles} from './styles';
import {useForm} from './components/useForm';
import WalletList from './components/WalletList';

const AddTransaction = ({
  navigation,
  route,
}: {
  navigation: NavigationType;
  route: any;
}) => {
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
  const [categoryText, setCategoryText] = useState<string>();
  const [walletText, setWalletText] = useState<string>();

  // show/hide category/wallet modal
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const notesRef = useRef(null);
  const {dark, colors} = useTheme();

  const selectCategory = (item: Category) => {
    setCategoryText(item.name);
    handleFormChange({...form, categoryId: item.id});
    setShowCategoryModal(false);
  };
  const selectWallet = (item: Wallet) => {
    setWalletText(item.name);
    handleFormChange({...form, walletId: item.id});
    setShowWalletModal(false);
  };

  // before leaving screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetForm();
        resetErrors();
        setWalletText(undefined);
        setCategoryText(undefined);
      };
    }, []),
  );

  // Fetch transaction and set default form data
  useEffect(() => {
    if (transactionId) setEditFormContent();
  }, [transactionId]);

  const setEditFormContent = async () => {
    const _transaction: Transaction = (await transactions.find(
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
      <View style={{flex: 1.4, marginRight: 5}}>
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
    );
  }

  return (
    <>
      <StatusBar backgroundColor={dark ? colors.surface : colors.primary} />
      <Appbar.Header>
        {transactionId ? (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        ) : null}
        <Appbar.Content
          title={transactionId ? 'EDIT TRANSACTION' : 'ADD TRANSACTION'}
        />
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
              returnKeyType="next"
              onSubmitEditing={() => notesRef.current?.focus()}
              blurOnSubmit={false}
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
              ref={notesRef}
            />

            {renderTransactionDateTime()}
            <AppSelect
              label="Category"
              placeholder="Select Category"
              value={categoryText!}
              error={errors.categoryId}
              left={<TextInput.Icon name="format-list-bulleted" />}
              open={showCategoryModal}
              onOpen={() => setShowCategoryModal(true)}
              onClose={() => setShowCategoryModal(false)}
              renderContent={() => <CategoryList onSelect={selectCategory} />}
            />

            {!transactionId && (
              <AppSelect
                label="Wallet"
                placeholder="Select Wallet"
                value={walletText!}
                error={errors.walletId}
                open={showWalletModal}
                onOpen={() => setShowWalletModal(true)}
                onClose={() => setShowWalletModal(false)}
                left={<TextInput.Icon name="bank" />}
                renderContent={() => <WalletList onSelect={selectWallet} />}
              />
            )}

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
