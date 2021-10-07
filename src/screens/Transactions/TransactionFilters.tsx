import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button} from 'react-native-paper';
import {AppDatePicker, AppMultiSelect} from '../../components';
import {DefaultDateFormat, responsiveHeight} from '../../constants';
import {observeCategories, observeWallets} from '../../database/helpers';
import {CategoryProps, WalletProps} from '../../database/models';
import {useForm} from './useFilterForm';

const _TransactionFilters: React.FC<{
  onFilter: Function;
  categories: CategoryProps[];
  wallets: WalletProps[];
}> = ({onFilter, categories, wallets}) => {
  const {form, submitting, handleFormChange, setSubmitting} = useForm();

  function prepareData(data: CategoryProps[] | WalletProps[]) {
    return data.map(item => ({id: item.id, name: item.name}));
  }

  function handleWalletSelection(items: {id: number; name: string}[]) {
    handleFormChange({...form, walletIds: items.map(i => i.id)});
  }

  function handleCategorySelection(items: {id: number; name: string}[]) {
    handleFormChange({...form, categoryIds: items.map(i => i.id)});
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{marginBottom: responsiveHeight(20)}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        {/* Filter by start and end dates */}
        <View style={{flex: 1, marginRight: 5}}>
          <AppDatePicker
            label="Start Date"
            showSoftInputOnFocus={false}
            value={dayjs(form.startDate).format(DefaultDateFormat)}
            date={form.startDate}
            onConfirm={(date: Date) =>
              handleFormChange({...form, startDate: date})
            }
          />
        </View>
        <View style={{flex: 1}}>
          <AppDatePicker
            label="End Date"
            showSoftInputOnFocus={false}
            value={dayjs(form.endDate).format(DefaultDateFormat)}
            date={form.endDate}
            onConfirm={(date: Date) =>
              handleFormChange({...form, endDate: date})
            }
          />
        </View>
      </View>

      <AppMultiSelect
        label="Wallets"
        options={prepareData(wallets)}
        style={{marginBottom: 10}}
        onSelected={handleWalletSelection}
        selectedValues={form.walletIds}
      />

      <AppMultiSelect
        label="Categories"
        options={prepareData(categories)}
        style={{marginBottom: 10}}
        onSelected={handleCategorySelection}
        selectedValues={form.categoryIds}
      />

      <Button
        mode="contained"
        style={{marginTop: 20}}
        disabled={submitting}
        onPress={() => {
          setSubmitting(true);
          onFilter(form);
          setSubmitting(false);
        }}>
        {submitting ? 'Please Wait...' : 'Apply Filter'}
      </Button>
    </ScrollView>
  );
};

const enhance = withObservables([], () => ({
  categories: observeCategories(),
  wallets: observeWallets(),
}));

const TransactionFilters = enhance(_TransactionFilters);

export default TransactionFilters;
