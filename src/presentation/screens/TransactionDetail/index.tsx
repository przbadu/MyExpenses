import dayjs from 'dayjs';
import React from 'react';
import {Alert, StatusBar, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Headline,
  Subheading,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {deleteTransaction, transactions} from '../../../database/helpers';
import {
  Category,
  Transaction,
  TransactionTypeEnum,
  Wallet,
} from '../../../database/models';
import {hexToRGBA, numberToCurrency, responsiveHeight} from '../../../lib';
import {CurrencyContext} from '../../hooks/context';

const TransactionDetail = ({navigation, route}: any) => {
  const {colors, dark} = useTheme();
  const {transactionId} = route.params;
  const {currency} = React.useContext(CurrencyContext);
  const [transaction, setTransaction] = React.useState<Transaction>();
  const [wallet, setWallet] = React.useState<Wallet>();
  const [category, setCategory] = React.useState<Category>();

  React.useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    const _transaction = (await transactions.find(
      transactionId,
    )) as Transaction;
    const _category = await _transaction.category;
    const _wallet = await _transaction.wallet;

    setTransaction(_transaction);
    setWallet(_wallet);
    setCategory(_category);
  };

  const handleDelete = () => {
    Alert.alert(
      'Permanently Delete Transaction',
      'You are permanently deleting this transaction and we will not be able to recover transaction after it is deleted, Are you sure to proceed?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Proceed',
          onPress: async () => {
            await deleteTransaction(transactionId);
            navigation.goBack();
          },
        },
      ],
      {cancelable: true},
    );
  };

  function renderRow(
    label: string,
    value: any,
    heading: boolean = false,
    isExpense: boolean = true,
  ) {
    return (
      <View style={{...styles.row, marginVertical: 10}}>
        <Subheading style={{flex: 1}}>{label}</Subheading>
        <Text style={{marginRight: 10}}>:</Text>

        <View style={{flex: 2}}>
          {heading ? (
            <Subheading
              style={{color: isExpense ? colors.notification : colors.success}}>
              {value}
            </Subheading>
          ) : (
            <Text>{value}</Text>
          )}
        </View>
      </View>
    );
  }

  const _color =
    transaction?.transactionType === TransactionTypeEnum.income
      ? colors.success
      : colors.notification;
  const statusbarColor = dark ? hexToRGBA('#000000', 0.84) : _color;

  return (
    <>
      <StatusBar backgroundColor={statusbarColor} />
      <Appbar.Header
        style={dark ? {elevation: 0} : {elevation: 0, backgroundColor: _color}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Transaction Detail" />
        <Appbar.Action
          icon="pencil-outline"
          onPress={() =>
            navigation.navigate('EditTransaction', {transactionId})
          }
        />
        <Appbar.Action icon="trash-can-outline" onPress={handleDelete} />
      </Appbar.Header>

      <Surface
        style={{
          backgroundColor: dark ? hexToRGBA(colors.onSurface, 0.11) : _color,
          alignItems: 'center',
          paddingVertical: 10,
          paddingBottom: 60,
        }}>
        <Headline style={{color: dark ? _color : colors.white}}>
          {numberToCurrency(+transaction?.amount!, currency)}
        </Headline>
        <Text style={{color: dark ? _color : colors.white, marginTop: 10}}>
          {dayjs(transaction?.transactionAt).format('YYYY-MM-DD HH:MM A')}
        </Text>
      </Surface>

      <Surface style={styles.detailsContainer}>
        {renderRow('Type', transaction?.transactionType)}
        {renderRow('Category', category?.name)}
        {renderRow('Wallet', wallet?.name)}
        {renderRow('Notes', transaction?.notes)}
      </Surface>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  detailsContainer: {
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: -responsiveHeight(5),
    padding: 20,
  },
  buttonSurface: {
    padding: 20,
    flexDirection: 'row',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginRight: 100,
  },
});

export {TransactionDetail};
