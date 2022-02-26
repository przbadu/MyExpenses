import {StatusBar, Appearance} from 'react-native';
import React from 'react';
import {darkTheme, hexToRGBA, lightTheme} from '../../helpers';

import {ThemeContext} from '../contexts';

const AppStatusBar = () => {
  const {theme} = React.useContext(ThemeContext);
  let appTheme = Appearance.getColorScheme() == 'dark' ? darkTheme : lightTheme;

  if (theme === 'light') appTheme = lightTheme;
  else if (theme === 'dark') appTheme = darkTheme;

  return (
    <StatusBar
      backgroundColor={
        appTheme.dark ? hexToRGBA('#000000', 0.84) : appTheme.colors.primary
      }
    />
  );
};

export default AppStatusBar;
