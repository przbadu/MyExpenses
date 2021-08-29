import {Appearance} from 'react-native';

import {
  LocalStorage,
  setupDefaultAccounts,
  setupDefaultCategories,
} from './index';

const SETUP_COMPLETED = 'SETUP_COMPLETED';
export const APP_THEME = 'APP_THEME';

export const initialSetup = async (): Promise<string | null> => {
  const isSetupCompleted = await LocalStorage.get(SETUP_COMPLETED);
  if (isSetupCompleted === 'true') {
    const theme = LocalStorage.get(APP_THEME);
    return theme;
  }

  // use user's system theme
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  await LocalStorage.set(APP_THEME, colorScheme === 'dark' ? 'dark' : 'light');

  // generate default categories and accounts
  await setupDefaultCategories();
  await setupDefaultAccounts();

  // setup completed
  await LocalStorage.set(SETUP_COMPLETED, 'true');

  return theme;
};
