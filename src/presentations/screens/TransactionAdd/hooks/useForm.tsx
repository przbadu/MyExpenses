import {NavigationProp, RouteProp} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';

import {DefaultTimeFormat} from '../../../../helpers';
import {TransactionTypeEnum} from '../../../../data/models';
import {RootStackParamList} from '../../../navigation/types';

const now = new Date();

export type FormProps = {
  amount: number;
  notes: string;
  transactionAt: Date;
  time?: string;
  transactionType: TransactionTypeEnum;
  isPaid: boolean;
  walletId?: string;
  categoryId?: string;
};

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

type Props = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'AddTransaction'>;
};

export const useForm = ({navigation, route}: Props) => {
  const transactionType = route?.params.type;
  const [form, setForm] = React.useState<FormProps>(initialFormState);
  const [errors, setErrors] = React.useState<ErrorProps | any>({});
  const [submitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    setForm({
      ...form,
      transactionType: transactionType || TransactionTypeEnum.expense,
    });
  }, [transactionType]);

  const handleFormChange = (formData: typeof form) => {
    setForm(formData);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formErrors = validate(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // await saveTransaction({...form});

      handleFormChange({...initialFormState});
      setSubmitting(false);

      navigation.navigate('ListTransactions');
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