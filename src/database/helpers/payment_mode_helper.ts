import {database} from '../index';
import {PaymentModeProps, PaymentMode} from '../models';

const accounts = database.collections.get(PaymentMode.table);

export const observeAccounts = () => accounts.query().observe();
// Create new payment mode
export const savePaymentMode = async ({
  name,
  isDefault = false,
}: PaymentModeProps) => {
  await database.write(async () => {
    await accounts.create(record => {
      record.name = name;
      record.isDefault = isDefault;
    });
  });
};
// Generate default seed data for new setup
export const setupDefaultPaymentMode = async () => {
  await savePaymentMode({name: 'Cash', isDefault: true});
  await savePaymentMode({name: 'Net Banking'});
  await savePaymentMode({name: 'ATM'});
  await savePaymentMode({name: 'Credit Card'});
  await savePaymentMode({name: 'Debit Card'});
  await savePaymentMode({name: 'Cheque'});
};
