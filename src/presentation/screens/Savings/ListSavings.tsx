import withObservables from '@nozbe/with-observables';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Caption,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  deleteSaving,
  observeSavingAmounts,
  observeSavings,
} from '../../../data/helpers';
import {Saving, SavingAmount} from '../../../data/models';
import {
  numberToCurrency,
  numberToHumanize,
  responsiveHeight,
} from '../../../lib';
import {CurrencyContext} from '../../hooks/context';

let ListSavings = ({
  navigation,
  savings,
  savingAmounts,
  route,
}: {
  navigation: any;
  savings: Saving[];
  savingAmounts: SavingAmount[];
  route: any;
}) => {
  const {currency} = React.useContext(CurrencyContext);
  const {fonts, colors} = useTheme();

  const totalRequiredAmount = savings.reduce(
    (sum, saving) => sum + saving.requiredAmount,
    0,
  );
  const totalTargetAmount = savings.reduce(
    (sum, saving) => sum + saving.targetAmount,
    0,
  );
  const totalSavingAmount = savingAmounts.reduce((sum, a) => sum + a.amount, 0);

  const percentValue = (saving: Saving) => {
    const percent = totalSavingAmount / saving.requiredAmount;

    return percent;
  };

  const handleDelete = async (saving: Saving) => {
    await deleteSaving(saving);
    navigation.setParams({add: false});
  };

  const currencyAmount = (amount: number) => numberToCurrency(amount, currency);

  const humanizeAmount = (amount: number) =>
    `${currency} ${numberToHumanize(amount)}`;

  function renderEmptyList() {
    return (
      <Surface style={{padding: 20}}>
        <Caption style={{textAlign: 'center'}}>No result found</Caption>
        <Button onPress={() => navigation.navigate('AddSaving')}>
          Add your first saving!
        </Button>
      </Surface>
    );
  }

  function renderSummary() {
    return (
      <Surface
        style={{
          margin: 10,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={styles.heading}>Total required amount</Text>
          <Text style={styles.heading}>Total saving target / month</Text>
          <Text style={styles.heading}>Current available saving amount</Text>
        </View>
        <View>
          <Text style={styles.heading}>
            {currencyAmount(totalRequiredAmount)}
          </Text>
          <Text style={styles.heading}>
            {currencyAmount(totalTargetAmount)}
          </Text>
          <Text style={styles.heading}>
            {currencyAmount(totalSavingAmount)}
          </Text>
        </View>
      </Surface>
    );
  }

  function renderItem(item: Saving) {
    return (
      <Surface
        style={{
          marginBottom: 5,
          padding: 10,
        }}>
        <View style={styles.row}>
          <View style={{maxWidth: '60%'}}>
            <Text style={{...fonts.medium}}>{item.title}</Text>
            <Text style={{...fonts.regular, color: colors.disabled}}>
              ({(item.requiredAmount - totalSavingAmount) / item.targetAmount}{' '}
              months to go)
            </Text>
          </View>
          <View>
            <Text>{humanizeAmount(item.requiredAmount)}</Text>
          </View>
        </View>

        <ProgressBar progress={percentValue(item)} color={colors.success} />

        <View style={styles.row}>
          <Text style={{...fonts.medium, color: colors.disabled}}>
            {humanizeAmount(item.targetAmount)} / month
          </Text>
          <Text style={{...fonts.medium, color: colors.disabled}}>
            {humanizeAmount(totalSavingAmount)}
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={'Savings'.toUpperCase()} />

        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate('AddSaving')}
        />
      </Appbar.Header>

      {renderSummary()}

      <FlatList
        data={savings}
        keyExtractor={item => `saving-${item.id}`}
        renderItem={({item}: {item: Saving}) => renderItem(item)}
        ListEmptyComponent={renderEmptyList()}
        style={{margin: 10}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

ListSavings = withObservables([], () => ({
  savings: observeSavings(),
  savingAmounts: observeSavingAmounts(),
}))(ListSavings);

export {ListSavings};
