import {database} from '../index';
import {Account, AccountProps} from '../models';

const accounts = database.collections.get(Account.table);

export const observeAccounts = () => accounts.query().observe();
// Create new account
export const saveAccount = async ({name, isDefault = false}: AccountProps) => {
  await database.write(async () => {
    await accounts.create(record => {
      record.name = name;
      record.isDefault = isDefault;
    });
  });
};
// Generate default seed data for new setup
export const setupDefaultAccounts = async () => {
  await saveAccount({name: 'Cash', isDefault: true});
  await saveAccount({name: 'Net Banking'});
  await saveAccount({name: 'ATM'});
  await saveAccount({name: 'Credit Card'});
  await saveAccount({name: 'Debit Card'});
  await saveAccount({name: 'Cheque'});
};
