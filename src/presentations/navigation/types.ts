import {TransactionTypeEnum} from '../../data/models';

export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  // transactions
  CalendarTransactions: undefined;
  CategoryTransactions: {categoryId: string; categoryName: string};
  ListTransactions: undefined;
  AddTransaction: {type: TransactionTypeEnum};
  EditTransaction: {transactionId: string};
  ShowTransaction: {transactionId: string};
  // categories
  AddCategory: undefined;
  EditCategory: {categoryId: string};
  ListCategories: undefined;
  // wallets
  AddWallet: undefined;
  EditWallet: {walletId: string};
  ListWallets: undefined;
  // Settings
  MainSettings: undefined;
};
