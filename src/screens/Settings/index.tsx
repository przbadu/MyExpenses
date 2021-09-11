import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Card, Switch} from 'react-native-paper';

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

  console.log(currency, 'currency');

  // render currency dropdown
  const renderCurrencySelect = () => (
    <>
      <AppSelect
        placeholder="Select currency"
        value={currency}
        icon="currency"
        onPress={() => setShowCurrencyModal(true)}
      />
      {showCurrencyModal && (
        <AppModal
          visible={showCurrencyModal}
          onClose={() => setShowCurrencyModal(false)}
          heading="Select Currency"
          renderContent={() => (
            <CurrencyList
              onSelect={async (item: any) => await updateCurrency(item.name)}
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
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>{renderCurrencySelect()}</Card.Content>
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
