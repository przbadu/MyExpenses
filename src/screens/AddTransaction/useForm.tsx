import React from 'react';
import {useNavigation} from '@react-navigation/core';
import dayjs from 'dayjs';

import {TransactionTypeEnum} from '../../database/models';
import {saveTransaction} from '../../database/helpers';

const now = new Date();

interface FormProps {
  amount: number | string;
  notes: string | '';
  transactionAt: Date;
  time: string;
  transactionType: TransactionTypeEnum;
  isPaid: boolean;
  walletId: string | number | undefined;
  categoryId: string | number | undefined;
}

interface ErrorProps {
  notes: string | null;
  categoryId: string | null;
  walletId: string | null;
}

const initialFormState = {
  amount: 0,
  notes: '',
  transactionAt: now,
  time: dayjs(now).format('HH:mm'),
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

export const useForm = () => {
  const navigation = useNavigation();
  const [form, setForm] = React.useState<FormProps>(initialFormState);
  const [errors, setErrors] = React.useState<ErrorProps | any>({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleFormChange = (formData: typeof form) => {
    setForm(formData);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const formErrors = validate(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      saveTransaction({...form});
      handleFormChange({...initialFormState});
      setSubmitting(false);
      navigation.navigate('Transactions');
    }
    setSubmitting(false);
  };

  return {form, handleSubmit, errors, handleFormChange, submitting};
};
