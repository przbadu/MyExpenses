import {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import dayjs from 'dayjs';
import React from 'react';
import {DefaultTimeFormat} from '../../../../lib';
import {saveTransaction, updateTransaction} from '../../../../data/helpers';
import {TransactionTypeEnum} from '../../../../data/models';
import {RootStackParamList} from '../../../navigation/types';

const now = new Date();

interface FormProps {
  amount: number;
  notes: string;
  transactionAt: Date;
  time?: string;
  transactionType: TransactionTypeEnum;
  isPaid: boolean;
  walletId?: string;
  categoryId?: string;
}

interface ErrorProps {
  notes: string;
  categoryId: string;
  walletId: string;
}

export const initialFormState = {
  amount: 0,
  notes: '',
  transactionAt: now,
  time: dayjs(now).format(DefaultTimeFormat),
  transactionType: TransactionTypeEnum.expense,
  isPaid: true,
  walletId: undefined,
  categoryId: undefined,
};

export const validate = (values: FormProps) => {
  let errors: ErrorProps | any = {};

  if (Number(values.amount) == 0) {
    errors.amount = 'Amount should not be 0';
  }

  if (!values.notes) {
    errors.notes = 'Please enter notes';
  } else if (values.notes.length > 255) {
    errors.notes = 'Notes can not be more than 255 characters.';
  }

  if (!values.categoryId) {
    errors.categoryId = 'Please select category';
  }

  if (!values.walletId) {
    errors.walletId = 'Please select wallet';
  }

  return errors;
};

export const useForm = (transactionId?: string) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [form, setForm] = React.useState<FormProps>(initialFormState);
  const [errors, setErrors] = React.useState<ErrorProps | any>({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleFormChange = (formData: typeof form) => {
    setForm(formData);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formErrors = validate(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (transactionId) await updateTransaction(transactionId, {...form});
      else await saveTransaction({...form});

      handleFormChange({...initialFormState});
      setSubmitting(false);

      if (transactionId) navigation.goBack();
      else navigation.navigate('Transactions');
    }
    setSubmitting(false);
  };

  const resetForm = () => setForm(initialFormState);
  const resetErrors = () => setErrors({});

  return {
    form,
    errors,
    submitting,
    resetForm,
    resetErrors,
    handleSubmit,
    handleFormChange,
  };
};