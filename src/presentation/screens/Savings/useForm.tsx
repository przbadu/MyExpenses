import React from 'react';
import {createSaving} from '../../../data/helpers';

const initialState = {
  title: '',
  requiredAmount: '',
  targetAmount: '',
  availableAmount: 0,
};

interface FormProps {
  id?: string;
  title: string;
  requiredAmount: number | string;
  targetAmount: number | string;
  availableAmount: number;
}

interface ErrorProps {
  title?: string | undefined;
  requiredAmount?: string | undefined;
  targetAmount?: string | undefined;
}

function validate(values: FormProps) {
  let errors: ErrorProps = {};

  if (Number(values.requiredAmount) === 0) {
    errors.requiredAmount = 'Amount is required and should not be 0';
  }

  if (Number(values.targetAmount) === 0) {
    errors.targetAmount = 'Target Amount is required and should not be 0';
  }

  if (!values.title) {
    errors.title = 'Please enter Title';
  } else if (values.title.length > 255) {
    errors.title = 'Title can not be more than 255 characters.';
  }

  return errors;
}

export const useForm = (navigation: any) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<FormProps>(initialState);
  const [errors, setErrors] = React.useState<ErrorProps>();

  function handleFormChange(formData: typeof form) {
    setForm(formData);
  }

  function resetForm() {
    setForm({...form, ...initialState});
  }

  async function handleSubmit() {
    setSubmitting(true);
    // validation
    const _formError = validate(form);
    setErrors(_formError);

    if (Object.keys(_formError).length === 0) {
      // create or update saving
      await createSaving(form);
      resetForm();
      setSubmitting(false);

      navigation.navigate('ListSavings');
    }
    setSubmitting(false);
  }

  return {form, submitting, errors, handleSubmit, handleFormChange, resetForm};
};
