// Responsive_Dimensions.js
import {Dimensions} from 'react-native';

export const responsiveHeight = (h: number) => {
  const {height} = Dimensions.get('window');
  return height * (h / 100);
};

export const responsiveWidth = (w: number) => {
  const {width} = Dimensions.get('window');
  return width * (w / 100);
};
