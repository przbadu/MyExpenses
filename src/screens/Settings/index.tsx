import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Appbar, Card, Switch} from 'react-native-paper';

import {AppModal, AppSelect, AppSwitch} from '../../components';
import {
  ThemeContext,
  ThemeContentProps,
  CurrencyContextProps,
  CurrencyContext,
} from '../../store/context';
import {CurrencyList} from './CurrencyList';

const Settings = () => {
  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);

  const {theme, toggleTheme} = useContext<ThemeContentProps>(ThemeContext);
  const {currency, updateCurrency} =
    useContext<CurrencyContextProps>(CurrencyContext);

  // render currency dropdown
  const renderCurrencySelect = () => (
    <View style={{marginTop: 10}}>
      <AppSelect
        placeholder="Select currency"
        value={currency}
        icon="currency-usd"
        onOpen={() => setShowCurrencyModal(true)}
      />
      {showCurrencyModal && (
        <AppModal
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
    </View>
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

          {renderCurrencySelect()}
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
});

export {Settings};
