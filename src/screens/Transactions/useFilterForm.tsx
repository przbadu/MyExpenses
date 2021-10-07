import dayjs from 'dayjs';
import React from 'react';
import {filterTransactionByProps} from '../../database/helpers';

const initialFormState = {
  startDate: new Date(dayjs().startOf('month').toDate()),
  endDate: new Date(),
  walletIds: undefined,
  categoryIds: undefined,
};

export const useForm = () => {
  const [form, setForm] =
    React.useState<filterTransactionByProps>(initialFormState);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let endDate = form.endDate;
    if (dayjs(form.startDate).isAfter(dayjs(endDate))) {
      endDate = form.startDate;
    }
    setForm({...form, endDate});
  }, [form.startDate, form.endDate]);

  const handleFormChange = (formData: typeof form) => {
    setForm(formData);
  };

  function resetFilter() {
    setForm({...form, ...initialFormState});
  }

  return {form, submitting, handleFormChange, setSubmitting, resetFilter};
};
