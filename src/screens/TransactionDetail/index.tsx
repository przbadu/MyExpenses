import dayjs from 'dayjs';
import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {
  Button,
  Headline,
  Subheading,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {numberToCurrency} from '../../constants';
import {deleteTransaction, transactions} from '../../database/helpers';
import {
  CategoryProps,
  TransactionProps,
  TransactionTypeEnum,
  WalletProps,
} from '../../database/models';
import {CurrencyContext} from '../../store/context';

const TransactionDetail = ({navigation, route}) => {
  const {transactionId} = route.params;
  const {currency} = React.useContext(CurrencyContext);
  const [transaction, setTransaction] = React.useState<TransactionProps>();
  const [wallet, setWallet] = React.useState<WalletProps>();
  const [category, setCategory] = React.useState<CategoryProps>();
  const {colors} = useTheme();

  React.useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    const _transaction = await transactions.find(transactionId);
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
            <Headline
              style={{color: isExpense ? colors.notification : colors.success}}>
              {value}
            </Headline>
          ) : (
            <Text>{value}</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <View>
          {renderRow('Type', transaction?.transactionType?.toUpperCase())}
          {renderRow('Category', category?.name)}
          {renderRow('Wallet', wallet?.name)}
          {renderRow('Notes', transaction?.notes)}
          {renderRow(
            'Date',
            `${dayjs(transaction?.transactionAt).format('YYYY-MM-DD')} ${
              transaction?.time
            }`,
          )}
          {renderRow(
            'Last Updated',
            dayjs(transaction?.updatedAt).format('YYYY-MM-DD HH:mm'),
          )}
          {renderRow(
            'Amount',
            numberToCurrency(transaction?.amount, currency),
            true,
            transaction?.transactionType == TransactionTypeEnum.expense,
          )}
        </View>
      </Surface>

      <Surface style={{...styles.buttonSurface}}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddTransaction', {transactionId})}
          icon="pencil-outline"
          style={{width: 100, marginRight: 10}}>
          Edit
        </Button>

        <Button
          mode="contained"
          onPress={handleDelete}
          icon="trash-can-outline"
          color={colors.notification}
          style={{width: 100, marginRight: 10}}>
          Delete
        </Button>

        <Button
          mode="outlined"
          icon="keyboard-backspace"
          onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  surface: {
    marginHorizontal: 10,
    padding: 20,
  },
  buttonSurface: {
    marginHorizontal: 10,
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
