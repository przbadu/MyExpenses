/**
 * @format
 */

import * as Sentry from '@sentry/react-native';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';
import {SentryConfig} from './src/lib';

Sentry.init(SentryConfig);

AppRegistry.registerComponent(appName, () => App);
