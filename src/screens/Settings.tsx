import React, {useContext} from 'react';
import {Appbar, Card, Switch} from 'react-native-paper';

import {AppSwitch} from '../components';
import {ThemeContext} from '../store/context/themeContext';

const Settings = () => {
  const {theme, toggleTheme} = useContext<any>(ThemeContext);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="SETTING" />
      </Appbar.Header>

      <Card style={{marginVertical: 10}}>
        <Card.Content>
          <AppSwitch label="Dark Theme">
            <Switch value={theme.dark} onValueChange={toggleTheme} />
          </AppSwitch>
        </Card.Content>
      </Card>
    </>
  );
};

export {Settings};
