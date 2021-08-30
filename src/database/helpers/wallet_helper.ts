import {database} from '../index';
import {Wallet, WalletProps} from '../models';

const wallets = database.collections.get(Wallet.table);

export const observeWallets = () => wallets.query().observe();
// Create new wallet
export const saveWallet = async ({name, isDefault = false}: WalletProps) => {
  await database.write(async () => {
    await wallets.create(record => {
      record.name = name;
      record.isDefault = isDefault;
    });
  });
};
// Generate default seed data for new setup
export const setupDefaultWallet = async () => {
  await saveWallet({name: 'Cash', isDefault: true});
  await saveWallet({name: 'Net Banking'});
  await saveWallet({name: 'ATM'});
  await saveWallet({name: 'Credit Card'});
  await saveWallet({name: 'Debit Card'});
  await saveWallet({name: 'Cheque'});
};
