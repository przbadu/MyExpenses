import React, {useContext} from 'react';
import {View} from 'react-native';
import {Headline, Card, Switch} from 'react-native-paper';

import {AppSwitch} from '../components';
import {ThemeContext} from '../store/context/themeContext';

const Settings = () => {
  const {theme, toggleTheme} = useContext(ThemeContext);

  return (
    <View style={{marginHorizontal: 10}}>
      <Headline style={{marginBottom: 20}}>Settings</Headline>
      <Card>
        <Card.Content>
          <AppSwitch label="Dark Theme">
            <Switch value={theme.dark} onValueChange={toggleTheme} />
          </AppSwitch>
        </Card.Content>
      </Card>
    </View>
  );
};

export {Settings};
