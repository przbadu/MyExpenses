import dayjs from 'dayjs';
import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {AppDatePicker} from '../../components';
import {DefaultDateFormat} from '../../constants';
import {useForm} from './useFilterForm';

const TransactionFilters: React.FC<{onFilter: Function}> = ({onFilter}) => {
  const {form, submitting, handleFormChange, setSubmitting} = useForm();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
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
    </>
  );
};

export default TransactionFilters;
