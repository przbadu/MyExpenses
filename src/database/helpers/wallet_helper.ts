import randomColor from 'randomcolor';

import {database} from '../index';
import {Wallet, WalletProps} from '../models';

export const wallets = database.collections.get(Wallet.table);

export const observeWallets = () => wallets.query().observe();

// Create new wallet
export const saveWallet = async ({
  name,
  isDefault = false,
  color,
}: WalletProps) => {
  await database.write(async () => {
    await wallets.create(entry => {
      entry.name = name;
      entry.isDefault = isDefault;
      entry.color = color;
    });
  });
};

export const updateWallet = async (
  category: Wallet,
  {name, color}: WalletProps,
) => {
  await database.write(async () => {
    await category.update(entry => {
      entry.name = name;
      entry.color = color;
    });
  });
};

export const deleteWallet = async (category: Wallet) => {
  await database.write(async () => {
    await category.destroyPermanently();
  });
};

// Generate default seed data for new setup
export const setupDefaultWallet = async () => {
  await saveWallet({name: 'Cash', isDefault: true, color: randomColor()});
  await saveWallet({name: 'Net Banking', color: randomColor()});
  await saveWallet({name: 'ATM', color: randomColor()});
  await saveWallet({name: 'Credit Card', color: randomColor()});
  await saveWallet({name: 'Debit Card', color: randomColor()});
  await saveWallet({name: 'Cheque', color: randomColor()});
};
