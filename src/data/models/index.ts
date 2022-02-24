// tempfix
export enum TransactionTypeEnum {
  expense,
  income,
}

// tempfix:
export type Category = {
  name: string;
  count: number;
  totalExpense: number;
  totalIncome: number;
  balanceAmount: number;
  icon: string;
  color: string;
};

export type Wallet = {
  name: string;
  count: number;
  totalExpense: number;
  totalIncome: number;
  balanceAmount: number;
  icon: string;
  color: string;
};

export type Transaction = {
  notes: string;
  transactionAt: Date;
  amount: number;
  transactionType: TransactionTypeEnum;
};
