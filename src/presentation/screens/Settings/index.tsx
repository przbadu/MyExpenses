import withObservables from '@nozbe/with-observables';
import React, {useContext, useEffect} from 'react';
import {Alert, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Caption,
  Card,
  Subheading,
  Switch,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppModal from '../../components/AppModal';
import AppSnackbar from '../../components/AppSnackbar';
import MenuItem from '../../components/MenuItem';
import {responsiveHeight} from '../../../lib';
import {observeCategories, observeWallets} from '../../../data/helpers';
import {Category, Wallet} from '../../../data/models';
import {
  ThemeContext,
  ThemeContentProps,
  CurrencyContextProps,
  CurrencyContext,
} from '../../hooks/context';
import {CurrencyList} from './CurrencyList';
import {resetDB} from '../../../data';
import dayjs from 'dayjs';
import {GoogleAuth} from '../../../data/sync/google_drive/GoogleAuth';
import {GoogleDriveSync} from '../../../data/sync/google_drive/GoogleDriveDatabaseSync';

let Settings = ({
  navigation,
  categories,
  wallets,
}: {
  navigation: any;
  categories: Category[];
  wallets: Wallet[];
}) => {
  const [downloading, setDownloading] = React.useState(false);
  const [isGoogleAuthorized, setIsGoogleAuthorized] = React.useState(false);
  const [autoSyncDrive, setAutoSyncDrive] = React.useState(true);

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);
  const [showThemeModal, setShowThemeModal] = React.useState(false);

  const {theme, changeTheme} = useContext<ThemeContentProps>(ThemeContext);
  const {currency, updateCurrency} =
    useContext<CurrencyContextProps>(CurrencyContext);

  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  useEffect(() => {
    new GoogleAuth().hasUserAuthorized().then(isAuthorized => {
      setIsGoogleAuthorized(isAuthorized);
    });
  }, []);

  async function signInWithGoogleAndSync(): Promise<void> {
    const googleAuth = new GoogleAuth();

    try {
      setDownloading(true);
      if (await googleAuth.hasUserAuthorized()) {
        setIsGoogleAuthorized(true);
        handleDownload();
      } else {
        await googleAuth.authorize();
        const result = await googleAuth.hasUserAuthorized();
        setIsGoogleAuthorized(result);
        handleDownload();
      }
      setDownloading(false);
    } catch (error: any) {
      setDownloading(false);
      Alert.alert(
        'Error',
        `Unable to authorize with Google Drive. Reason: ${error.message}`,
      );
    }
  }

  async function handleDownload(): Promise<void> {
    const googleSync = new GoogleDriveSync();

    const {file, hasUpdate} = await googleSync.hasRemoteUpdate(false);
    if (hasUpdate) {
      Alert.alert(
        'Replace local database?',
        "It seems like your Google Drive has latest database. Would you like to overwrite the app's current database with the version on Google Drive?",
        [
          {
            text: 'Yes, replace my local DB',
            onPress: async () => {
              console.log('User chose to replace local DB.');
              // Download the update
              await googleSync.download(file.id);
            },
          },
          {
            text: 'No, unlink Google Drive',
            onPress: () => unlinkFromGoogleDrive(false),
          },
        ],
        {cancelable: false},
      );
    } else {
      // Nothing exists on Dropbox yet, so kick off the 1st upload
      googleSync.upload();
    }
  }

  function unlinkFromGoogleDrive(withPermission: boolean = false) {
    console.log('Unlinking from Google Drive.');
    if (withPermission) {
      Alert.alert(
        'Unlink from Google Drive?',
        'Are you sure you want to unlink from Google Drive?',
        [
          {
            text: 'Yes, unlink',
            onPress: async () => {
              new GoogleAuth().revokeAuthorization().then(() => {
                setIsGoogleAuthorized(false);
              });
            },
          },
          {
            text: 'No, cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      new GoogleAuth().revokeAuthorization().then(() => {
        setIsGoogleAuthorized(false);
      });
    }
  }

  // manually upload to google drive
  async function handleUpload() {
    const googleSync = new GoogleDriveSync();
    await googleSync.upload();
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
        await RNFetchBlob.fs.writeFile(dbPath, backupFile, 'base64');
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

  function renderSyncOptions() {
    if (!isGoogleAuthorized) {
      return (
        <MenuItem
          label={'Connect With Google Drive'}
          icon={'google-drive'}
          iconSize={22}
          loading={downloading}
          onPress={signInWithGoogleAndSync}
        />
      );
    }

    return (
      <>
        <MenuItem
          label="Backup file automatically?"
          onPress={() => setAutoSyncDrive(!autoSyncDrive)}>
          <Switch
            value={autoSyncDrive}
            onValueChange={() => setAutoSyncDrive(!autoSyncDrive)}
          />
        </MenuItem>
        {autoSyncDrive && (
          <Caption>
            If this option is enabled it will push your changes to google drive
            after every transaction, category, wallets, etc is added, deleted or
            updated, if you are connected to wifi or mobile data network.
          </Caption>
        )}
        {!autoSyncDrive && (
          <>
            <MenuItem
              label="Upload To Google Drive"
              icon={'cloud-upload-outline'}
              iconSize={22}
              loading={downloading}
              onPress={handleUpload}
            />

            <MenuItem
              label={'Download From Google Drive'}
              icon={'cloud-download-outline'}
              iconSize={22}
              loading={downloading}
              onPress={signInWithGoogleAndSync}
            />
          </>
        )}

        <MenuItem
          label="Unlink From Google Drive"
          icon={'earth-remove'}
          iconSize={22}
          onPress={() => unlinkFromGoogleDrive(true)}
        />
      </>
    );
  }

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
          <Card.Content>{renderSyncOptions()}</Card.Content>
        </Card>

        <Subheading style={{marginHorizontal: 10, marginVertical: 10}}>
          DATA BACKUP
        </Subheading>
        <Card style={{...styles.card}}>
          <Card.Content>
            <MenuItem
              label="Create data backup"
              icon="database-export"
              onPress={handleBackup}
            />
            <MenuItem
              label="Restore data"
              icon="database-import"
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
