import {Q} from '@nozbe/watermelondb';
import {generateColor} from '../../lib';
import {database} from '../index';
import {Wallet, WalletProps} from '../models';

export const wallets = database.collections.get(Wallet.table);

export const observeWallets = () => wallets.query().observe();

export const walletsWithAmount = () => {
  const query = `
    select
      wallets.id,
      name,
      color,
      (select sum(amount) from transactions where transaction_type = 'Income' and wallet_id = wallets.id) totalIncome,
      (select sum(amount) from transactions where transaction_type = 'Expense' and wallet_id = wallets.id) totalExpense,
      count(*) as count
    from wallets
    LEFT JOIN transactions on transactions.wallet_id = wallets.id
    group by wallets.id
    order by name DESC
  `;
  return wallets.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
};

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

export const deleteWallet = async (wallet: Wallet) => {
  await database.write(async () => {
    const _wallet = await wallets.find(wallet.id);
    if (_wallet) await _wallet.destroyPermanently();
  });
};

// Generate default seed data for new setup
export const setupDefaultWallet = async () => {
  await saveWallet({name: 'Cash', isDefault: true, color: generateColor()});
  await saveWallet({name: 'Net Banking', color: generateColor()});
  await saveWallet({name: 'ATM', color: generateColor()});
  await saveWallet({name: 'Credit Card', color: generateColor()});
  await saveWallet({name: 'Debit Card', color: generateColor()});
  await saveWallet({name: 'Cheque', color: generateColor()});
};
