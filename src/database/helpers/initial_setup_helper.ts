import {
  LocalStorage,
  setupDefaultPaymentMode,
  setupDefaultCategories,
} from './index';

const SETUP_COMPLETED = 'SETUP_COMPLETED';

export const initialSetup = async (): Promise<void> => {
  const isSetupCompleted = await LocalStorage.get(SETUP_COMPLETED);
  if (isSetupCompleted === 'true') return;

  // generate default categories and accounts
  await setupDefaultCategories();
  await setupDefaultPaymentMode();

  // setup completed
  await LocalStorage.set(SETUP_COMPLETED, 'true');
};
