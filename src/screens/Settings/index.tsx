import withObservables from '@nozbe/with-observables';
import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, Card, Switch} from 'react-native-paper';

import {AppModal, AppSwitch, MenuItem} from '../../components';
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
  const {theme, toggleTheme} = useContext<ThemeContentProps>(ThemeContext);
  const {currency, updateCurrency} =
    useContext<CurrencyContextProps>(CurrencyContext);

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
        <Appbar.Content title="SETTING" />
      </Appbar.Header>

      <Card style={{...styles.card, marginTop: 10}}>
        <Card.Content>
          <AppSwitch label="Dark Theme">
            <Switch value={theme.dark} onValueChange={toggleTheme} />
          </AppSwitch>

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

          {renderCurrencySelect()}
        </Card.Content>
      </Card>
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
