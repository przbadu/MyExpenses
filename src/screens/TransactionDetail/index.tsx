import dayjs from 'dayjs';
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  Button,
  Headline,
  Subheading,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {numberToCurrency} from '../../constants';
import {categories, transactions, wallets} from '../../database/helpers';
import {
  CategoryProps,
  TransactionProps,
  WalletProps,
} from '../../database/models';

const TransactionDetail = ({navigation, route}) => {
  const {transactionId} = route.params;
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

  function renderRow(label: string, value: any, heading: boolean = false) {
    return (
      <View style={{...styles.row, marginVertical: 10}}>
        <Subheading style={{flex: 1}}>{label}</Subheading>
        <Text style={{marginRight: 10}}>:</Text>

        <View style={{flex: 2}}>
          {heading ? (
            <Headline style={{color: colors.success}}>{value}</Headline>
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
          {renderRow('Amount', numberToCurrency(transaction?.amount), true)}
        </View>
      </Surface>

      <Surface style={{...styles.buttonSurface}}>
        <Button
          mode="contained"
          onPress={() => {}}
          icon="pencil-outline"
          style={{width: 100, marginRight: 10}}>
          Edit
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
