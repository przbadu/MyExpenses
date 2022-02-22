import {Dimensions} from 'react-native';
import {responsiveHeight} from '..';

test('#responsiveHeight should return responsive height value based on current window height', () => {
  const height = responsiveHeight(50);

  expect(height).toBe(Dimensions.get('window').height * (50 / 100));
});

test('#responsiveWidth should return responsive width value based on current window width', () => {
  const height = responsiveHeight(50);

  expect(height).toBe(Dimensions.get('window').height * (50 / 100));
});
