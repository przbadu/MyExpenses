import React from 'react';
import dayjs from 'dayjs';
import {filterTransactionByProps} from '../../database/helpers';
import {DefaultDateFormat} from '../../constants';

const initialFormState = {
  startDate: dayjs().subtract(1, 'month').format(DefaultDateFormat),
  endDate: dayjs().format(DefaultDateFormat),
  walletIds: undefined,
  categoryIds: undefined,
};

export const useForm = () => {
  const [form, setForm] =
    React.useState<filterTransactionByProps>(initialFormState);
  const [submitting, setSubmitting] = React.useState(false);

  const handleFormChange = (formData: typeof form) => {
    setForm(formData);
  };

  const handleSubmit = () => {
    setSubmitting(true);

    // saveTransaction({...form});
    handleFormChange({...initialFormState});
    setSubmitting(false);
  };

  return {form, handleSubmit, handleFormChange, submitting};
};
