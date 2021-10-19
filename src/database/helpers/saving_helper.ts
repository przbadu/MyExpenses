import {Title} from 'react-native-paper';
import {database} from '../index';
import {Saving, SavingAmount, SavingProps} from '../models';

export const savings = database.get(Saving.table);
export const savingAmounts = database.get(SavingAmount.table);

export const observeSavings = () => savings.query().observe();
export const observeSavingAmounts = () => savingAmounts.query().observe();

interface createSavingProps extends SavingProps {
  availableAmount: number;
}
export const createSaving = async ({
  title,
  requiredAmount,
  targetAmount,
  availableAmount,
}: createSavingProps) => {
  await database.write(async () => {
    await savings.create((entry: Saving | any) => {
      entry.title = title;
      entry.requiredAmount = requiredAmount;
      entry.targetAmount = targetAmount;
    });

    if (Number(availableAmount) > 0) {
      await savingAmounts.create((entry: SavingAmount | any) => {
        entry.amount = availableAmount;
      });
    }
  });
};

export const createSavingAmount = async (amount: number) => {
  await database.write(async () => {
    await savingAmounts.create((entry: SavingAmount | any) => {
      entry.amount = amount;
    });
  });
};

export const updateSaving = async (
  saving: Saving,
  {title, requiredAmount, targetAmount}: SavingProps,
) => {
  await database.write(async () => {
    await saving.update(entry => {
      entry.title = title;
      entry.requiredAmount = requiredAmount;
      entry.targetAmount = targetAmount;
    });
  });
};

export const deleteSaving = async (saving: Saving) => {
  await database.write(async () => {
    await saving.destroyPermanently();
  });
};
