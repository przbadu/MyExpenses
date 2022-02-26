import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import App from '../src/App';

// without this, test case are failing
jest.useFakeTimers();

it('renders correctly', async () => {
  renderer.create(<App />);
});
