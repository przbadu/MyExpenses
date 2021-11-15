import withObservables from '@nozbe/with-observables';
import React, {useContext} from 'react';
import {Alert, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
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

let Settings = ({
  navigation,
  categories,
  wallets,
}: {
  navigation: any;
  categories: Category[];
  wallets: WalletProps[];
}) => {
  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);
  const [showThemeModal, setShowThemeModal] = React.useState(false);

  const {theme, changeTheme} = useContext<ThemeContentProps>(ThemeContext);
  const {currency, updateCurrency} =
    useContext<CurrencyContextProps>(CurrencyContext);

  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  const handleClearData = () => {
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
  };

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
            <MenuItem
              label="Dropbox"
              icon="dropbox"
              onPress={() => navigation.navigate('ListCategories')}
            />
            <MenuItem
              label="Google Drive"
              icon="google-drive"
              iconSize={22}
              onPress={() => {}}
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
              onPress={() => {}}
            />
            <MenuItem
              label="Restore data"
              icon="cloud-download-outline"
              onPress={() => {}}
            />
            <MenuItem
              label="Clear Data"
              icon="trash-can"
              onPress={handleClearData}
            />
          </Card.Content>
        </Card>

        <AppSnackbar
          visible={snackbar}
          onDismiss={() => setSnackbar(false)}
          message={snackbarMsg}
        />
        <ActivityIndicator animating={loading} />
      </ScrollView>
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
