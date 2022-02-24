import {useContext} from 'react';
import {CurrencyContext} from '../contexts/currencyContext';

export const useCurrency = (): {
  currency: string;
  updateCurrency: (currency: string) => Promise<void>;
} => {
  return useContext(CurrencyContext);
};
