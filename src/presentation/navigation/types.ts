export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  CalendarTransactions: undefined;
  CategoryTransactions: {categoryId: string; categoryName: string};
  Transactions: undefined;
  AddTransaction: undefined;
  EditTransaction: {transactionId: string};
  TransactionDetail: {transactionId: string};
  AddCategory: undefined;
  EditCategory: {categoryId: string};
  ListCategories: undefined;
  AddWallet: undefined;
  EditWallet: {walletId: string};
  ListWallets: undefined;
  MainSettings: undefined;
};
