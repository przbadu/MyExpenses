import React from 'react';
import {useTheme} from 'react-native-paper';

import {TransactionTypeEnum} from '../../../../data/models';
import {hexToRGBA} from '../../../../helpers';
import {SwitchButton, SwitchButtonContent} from '../../../components';
import {FormProps} from '../hooks/useForm';

type Props = {
  form: FormProps;
  handleFormChange: (formData: FormProps) => void;
};

const TransactionSwitchButton = ({form, handleFormChange}: Props) => {
  const {colors} = useTheme();

  function toggleTransactonType() {
    let type = TransactionTypeEnum.income;
    if (form.transactionType == TransactionTypeEnum.income)
      type = TransactionTypeEnum.expense;

    handleFormChange({
      ...form,
      transactionType: type,
    });
  }

  return (
    <SwitchButton
      onPress={toggleTransactonType}
      containerStyles={{marginBottom: 10}}>
      <SwitchButtonContent
        icon="cash-minus"
        label="Expense"
        active={form.transactionType == TransactionTypeEnum.expense}
        containerStyle={{
          backgroundColor:
            form.transactionType === TransactionTypeEnum.expense
              ? hexToRGBA(colors.error, 0.6)
              : colors.background,
        }}
      />
      <SwitchButtonContent
        icon="cash-plus"
        label="Income"
        active={form.transactionType == TransactionTypeEnum.income}
        containerStyle={{
          backgroundColor:
            form.transactionType === TransactionTypeEnum.income
              ? hexToRGBA(colors.success, 0.6)
              : colors.background,
        }}
      />
    </SwitchButton>
  );
};

export default TransactionSwitchButton;
