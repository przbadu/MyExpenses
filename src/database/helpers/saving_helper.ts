import {database} from '../index';
import {Saving, SavingProps} from '../models';

export const savings = database.collections.get(Saving.table);

export const observeSavings = () => savings.query().observe();

export const saveSaving = async ({
  title,
  requiredAmount,
  targetAmount,
}: SavingProps) => {
  await database.write(async () => {
    await savings.create((entry: Saving | any) => {
      entry.title = title;
      entry.requiredAmount = requiredAmount;
      entry.targetAmount = targetAmount;
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
