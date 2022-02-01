import React from 'react';
import {LocalStorage} from '../../../database/helpers';

const defaultCurrency = 'NPR';
const KEY = 'CURRENCY';

export interface CurrencyContextProps {
  currency: string;
  updateCurrency: (currency: string) => Promise<void>;
}

export const CurrencyContext = React.createContext<CurrencyContextProps>({
  currency: 'NPR',
  updateCurrency: async () => {},
});

export const CurrencyProvider = ({children}: {children: React.ReactNode}) => {
  const [currency, setCurrency] = React.useState(defaultCurrency);

  React.useEffect(() => {
    setupCurrency();
  }, []);

  const setupCurrency = async () => {
    const c = await LocalStorage.get(KEY);
    if (c) setCurrency(c);
  };

  const updateCurrency = async (currency: string) => {
    await LocalStorage.set(KEY, currency);
    setCurrency(currency);
  };

  return (
    <CurrencyContext.Provider value={{currency, updateCurrency}}>
      {children}
    </CurrencyContext.Provider>
  );
};
