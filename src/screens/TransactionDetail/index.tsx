import dayjs from 'dayjs';
import React from 'react';
import {Alert, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Headline,
  Subheading,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {deleteTransaction, transactions} from '../../database/helpers';
import {
  CategoryProps,
  Transaction,
  TransactionProps,
  TransactionTypeEnum,
  WalletProps,
} from '../../database/models';
import {
  hexToRGBA,
  numberToCurrency,
  responsiveHeight,
  responsiveWidth,
} from '../../lib';
import {CurrencyContext} from '../../store/context';
import {AppColorPicker} from '../../components';

const TransactionDetail = ({navigation, route}: any) => {
  const {colors, dark} = useTheme();
  const {transactionId} = route.params;
  const {currency} = React.useContext(CurrencyContext);
  const [transaction, setTransaction] = React.useState<TransactionProps>();
  const [wallet, setWallet] = React.useState<WalletProps>();
  const [category, setCategory] = React.useState<CategoryProps>();

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

  const _color =
    transaction?.transactionType === TransactionTypeEnum.income
      ? colors.success
      : colors.notification;
  const mainColor = dark ? hexToRGBA(_color, 0.11) : _color;

  return (
    <>
      <StatusBar backgroundColor={mainColor} />
      <Appbar.Header style={{elevation: 0, backgroundColor: mainColor}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Transaction Detail" />
        <Appbar.Action
          icon="pencil-outline"
          onPress={() => navigation.navigate('AddTransaction', {transactionId})}
        />
        <Appbar.Action icon="trash-can-outline" onPress={handleDelete} />
      </Appbar.Header>

      <Surface
        style={{
          backgroundColor: mainColor,
          alignItems: 'center',
          paddingVertical: 10,
          paddingBottom: 60,
        }}>
        <Headline style={{color: colors.white}}>
          {numberToCurrency(+transaction?.amount!, currency)}
        </Headline>
        <Text style={{color: colors.white, marginTop: 10}}>
          {dayjs(transaction?.transactionAt).format('YYYY-MM-DD HH:MM A')}
        </Text>
      </Surface>

      <Surface style={styles.detailsContainer}>
        <View>
          <Text>Type</Text>
          <Text style={{fontWeight: 'bold'}}>
            {transaction?.transactionType}
          </Text>
        </View>
        <View>
          <Text>Category</Text>
          <Text style={{fontWeight: 'bold'}}>{category?.name}</Text>
        </View>
        <View>
          <Text>Wallet</Text>
          <Text style={{fontWeight: 'bold'}}>{wallet?.name}</Text>
        </View>
      </Surface>

      <Surface
        style={{
          marginHorizontal: 10,
          marginTop: 20,
          padding: 10,
          paddingHorizontal: 20,
        }}>
        <Headline>Notes:</Headline>
        <Text>{transaction?.notes}</Text>
      </Surface>

      <View style={{marginTop: 20, marginHorizontal: 10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('AddTransaction', {transactionId})
            }
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
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
