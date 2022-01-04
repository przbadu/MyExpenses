import withObservables from '@nozbe/with-observables';
import React, {useContext} from 'react';
import {Alert, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import {
  ActivityIndicator,
  Appbar,
  Card,
  Subheading,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppModal, AppSnackbar, MenuItem} from '../../components';
import {responsiveHeight} from '../../lib';
import {observeCategories, observeWallets} from '../../database/helpers';
import {Category, WalletProps} from '../../database/models';
import {
  ThemeContext,
  ThemeContentProps,
  CurrencyContextProps,
  CurrencyContext,
} from '../../store/context';
import {CurrencyList} from './CurrencyList';
import {resetDB} from '../../database';
import dayjs from 'dayjs';
import {GoogleAuth} from '../../sync/google_drive/GoogleAuth';

let Settings = ({
  navigation,
  categories,
  wallets,
}: {
  navigation: any;
  categories: Category[];
  wallets: WalletProps[];
}) => {
  const [isGoogleAuthorized, setIsGoogleAuthorized] = React.useState(false);

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);
  const [showThemeModal, setShowThemeModal] = React.useState(false);

  const {theme, changeTheme} = useContext<ThemeContentProps>(ThemeContext);
  const {currency, updateCurrency} =
    useContext<CurrencyContextProps>(CurrencyContext);

  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  React.useEffect(() => {
    async () => {
      const _isLoggedIn = await new GoogleAuth().hasUserAuthorized();
      setIsGoogleAuthorized(_isLoggedIn);
    };
  }, []);

  async function signInWithGoogle(): Promise<void> {
    const googleAuth = new GoogleAuth();
    if (await googleAuth.hasUserAuthorized()) {
      setIsGoogleAuthorized(true);
      return;
    }

    await googleAuth.authorize();
    const result = await googleAuth.hasUserAuthorized();
    setIsGoogleAuthorized(result);
  }

  function handleClearData() {
    Alert.alert(
      'Permanently Delete All Data',
      'You are permanently deleting transactions, wallets, categories, and savings and we will not be able to recover data after it is deleted, Are you sure to proceed?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes, I agree',
          onPress: async () => {
            setLoading(true);
            await resetDB();
            setLoading(false);
            setSnackbarMsg('Data cleared successfully!');
            setSnackbar(true);
          },
        },
      ],
      {cancelable: true},
    );
  }

  async function handleBackup() {
    const dbPath = '/data/data/com.przbadu.myexpense/watermelon.db';
    const fileName = `myexpenses-${dayjs().format('YYYY-MM-DD-hh-mm-ss-a')}.db`;
    const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      await RNFS.copyFile(dbPath, downloadPath);
      setSnackbarMsg(`Database backup successful: ${downloadPath}`);
      setSnackbar(true);
    } catch (error) {
      setSnackbarMsg(`Error on backup process: ${error}`);
      setSnackbar(true);
    }
  }

  async function handleRestore() {
    const dbPath = '/data/data/com.przbadu.myexpense/watermelondb.db';
    const backupFile = await selectFileToUpload();

    try {
      if (backupFile) {
        // const fileContent = await RNFS.readFile(backupFile, 'ascii');
        // await RNFS.writeFile(dbPath, fileContent);
        RNFetchBlob.fs.writeFile(dbPath, backupFile, 'uri');
        setSnackbarMsg('Database restored successful');
        setSnackbar(true);
      }
    } catch (error) {
      setSnackbarMsg(`Error on restore process: ${error}`);
      setSnackbar(true);
    }
  }

  async function selectFileToUpload() {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      return res.uri;
      // return await RNFS.readFile(file);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setSnackbarMsg(`ImportCSV Canceld by user : ${error}`);
        setSnackbar(true);
      } else {
        setSnackbarMsg(`ImportCSV Unknown error : ${error}`);
        setSnackbar(true);
      }
    }
  }

  const renderThemeSelect = () => (
    <>
      <MenuItem
        label="Select Theme"
        chipLabel={theme}
        onPress={() => setShowThemeModal(true)}
      />
      {showThemeModal && (
        <AppModal
          transparentAreaHeight={responsiveHeight(60)}
          visible={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          heading="Select Theme"
          renderContent={() =>
            ['light', 'dark', 'system'].map(t => {
              return (
                <TouchableOpacity
                  key={`theme-${t}`}
                  onPress={() => {
                    changeTheme(t);
                    setShowThemeModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    marginVertical: 10,
                  }}>
                  <Text>{t.toString().toUpperCase()}</Text>
                  {t === theme && <Icon name="check" size={24} />}
                </TouchableOpacity>
              );
            })
          }
        />
      )}
    </>
  );

  // render currency dropdown
  const renderCurrencySelect = () => (
    <>
      <MenuItem
        label="Select Currency"
        chipLabel={currency}
        onPress={() => setShowCurrencyModal(true)}
      />
      {showCurrencyModal && (
        <AppModal
          transparentAreaHeight={responsiveHeight(10)}
          visible={showCurrencyModal}
          onClose={() => setShowCurrencyModal(false)}
          heading="Select Currency"
          renderContent={() => (
            <CurrencyList
              currency={currency}
              onSelect={(item: any) => {
                updateCurrency(item.isoCode);
                setShowCurrencyModal(false);
              }}
            />
          )}
        />
      )}
    </>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="SETTINGS" />
      </Appbar.Header>

      <ScrollView style={{flex: 1, marginBottom: responsiveHeight(8)}}>
        <Subheading style={{marginHorizontal: 10, marginVertical: 10}}>
          GENERAL SETTINGS
        </Subheading>
        <Card style={{...styles.card}}>
          <Card.Content>
            {renderThemeSelect()}
            {renderCurrencySelect()}

            <MenuItem
              label="Categories"
              chipLabel={`${categories.length}`}
              onPress={() => navigation.navigate('ListCategories')}
            />
            <MenuItem
              label="Wallets"
              chipLabel={`${wallets.length}`}
              onPress={() => navigation.navigate('ListWallets')}
            />
          </Card.Content>
        </Card>

        <Subheading style={{marginHorizontal: 10, marginVertical: 10}}>
          SYNCHRONIZATION
        </Subheading>
        <Card style={{...styles.card}}>
          <Card.Content>
            {/* <MenuItem label="Dropbox" icon="dropbox" onPress={() => {}} /> */}
            <MenuItem
              label="Google Drive"
              icon={isGoogleAuthorized ? 'database-sync' : 'google-drive'}
              iconSize={22}
              onPress={signInWithGoogle}
            />
          </Card.Content>
        </Card>

        <Subheading style={{marginHorizontal: 10, marginVertical: 10}}>
          DATA BACKUP
        </Subheading>
        <Card style={{...styles.card}}>
          <Card.Content>
            <MenuItem
              label="Create data backup"
              icon="cloud-upload-outline"
              onPress={handleBackup}
            />
            <MenuItem
              label="Restore data"
              icon="cloud-download-outline"
              onPress={handleRestore}
            />
            <MenuItem
              label="Clear Data"
              icon="trash-can"
              onPress={handleClearData}
            />
          </Card.Content>
        </Card>
      </ScrollView>
      <ActivityIndicator animating={loading} />
      <AppSnackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        message={snackbarMsg}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 5,
  },
  textMenu: {
    marginTop: 15,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

Settings = withObservables([], () => ({
  categories: observeCategories(),
  wallets: observeWallets(),
}))(Settings);

export {Settings};
