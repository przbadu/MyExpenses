import React, {useCallback, useRef, useState} from 'react';
import {
  useFocusEffect,
  NavigationProp,
  RouteProp,
} from '@react-navigation/core';
import dayjs from 'dayjs';
import {ScrollView, StatusBar, View} from 'react-native';
import {Appbar, Card, TextInput, useTheme} from 'react-native-paper';

import AppDatePicker from '../../components/AppDatePicker';
import AppSelect from '../../components/AppSelect';
import AppTextInput from '../../components/AppTextInput';
import SwitchButton from '../../components/SwitchButton';
import SwitchButtonContent from '../../components/SwitchButtonContent';
import {DefaultDateFormat} from '../../../helpers';
import {Category, TransactionTypeEnum, Wallet} from '../../../data/models';
import CategoryList from './components/CategoryList';
import {styles} from './styles';
import {useForm} from './hooks/useForm';
import {RootStackParamList} from '../../navigation/types';
import {AppButton} from '../../components';
import TransactionSwitchButton from './components/TransactionSwitchButton';

type Props = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'AddTransaction'>;
};

const TransactionAddScreen = ({navigation, route}: Props) => {
  const transactionForm = useForm({navigation, route});

  const [categoryText, setCategoryText] = useState<string>();
  const [walletText, setWalletText] = useState<string>();

  // show/hide category/wallet modal
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const notesRef = useRef(null);
  const {dark, colors} = useTheme();

  const selectCategory = (item: Category) => {
    setCategoryText(item.name);
    transactionForm.handleFormChange({
      ...transactionForm.form,
      categoryId: item.id,
    });
    setShowCategoryModal(false);
  };
  const selectWallet = (item: Wallet) => {
    setWalletText(item.name);
    transactionForm.handleFormChange({
      ...transactionForm.form,
      walletId: item.id,
    });
    setShowWalletModal(false);
  };

  // before leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        transactionForm.resetForm();
        transactionForm.resetErrors();
        setWalletText(undefined);
        setCategoryText(undefined);
      };
    }, []),
  );

  function renderTransactionDateTime() {
    return (
      <View style={{flex: 1.4, marginRight: 5}}>
        <AppDatePicker
          label="Date"
          showSoftInputOnFocus={false}
          value={dayjs(transactionForm.form.transactionAt).format(
            DefaultDateFormat,
          )}
          date={transactionForm.form.transactionAt}
          onConfirm={(date: Date) =>
            transactionForm.handleFormChange({
              ...transactionForm.form,
              transactionAt: date || transactionForm.form.transactionAt,
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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'ADD TRANSACTION'} />
      </Appbar.Header>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Card style={styles.container}>
          <Card.Content>
            <TransactionSwitchButton
              form={transactionForm.form}
              handleFormChange={transactionForm.handleFormChange}
            />
            <AppTextInput
              label="Amount"
              placeholder="0.00"
              value={String(transactionForm.form.amount)}
              onChangeText={text => {
                transactionForm.handleFormChange({
                  ...transactionForm.form,
                  amount: text,
                });
              }}
              keyboardType="decimal-pad"
              selectTextOnFocus
              left={<TextInput.Icon name="currency-usd" />}
              error={transactionForm.errors.amount}
              returnKeyType="next"
              onSubmitEditing={() => notesRef.current?.focus()}
              blurOnSubmit={false}
            />
            <AppTextInput
              label="Notes"
              placeholder="Enter your notes"
              maxLength={255}
              value={transactionForm.form.notes}
              onChangeText={text =>
                transactionForm.handleFormChange({
                  ...transactionForm.form,
                  notes: text,
                })
              }
              right={
                <TextInput.Affix
                  text={`${transactionForm.form.notes.length}/255`}
                />
              }
              left={<TextInput.Icon name="calendar-text" />}
              error={transactionForm.errors.notes}
              ref={notesRef}
            />

            {renderTransactionDateTime()}
            <AppSelect
              label="Category"
              placeholder="Select Category"
              value={categoryText!}
              error={transactionForm.errors.categoryId}
              left={<TextInput.Icon name="format-list-bulleted" />}
              open={showCategoryModal}
              onOpen={() => setShowCategoryModal(true)}
              onClose={() => setShowCategoryModal(false)}
              renderContent={() => <CategoryList onSelect={selectCategory} />}
            />

            <AppButton
              icon="database-plus"
              mode="contained"
              onPress={transactionForm.handleSubmit}
              submitting={transactionForm.submitting}
              style={{marginTop: 20, marginBottom: 10, padding: 10}}
              color={
                transactionForm.form.transactionType ===
                TransactionTypeEnum.expense
                  ? colors.error
                  : colors.success
              }>
              {`Save ${transactionForm.form.transactionType}`}
            </AppButton>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

export default TransactionAddScreen;
