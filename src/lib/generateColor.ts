import randomColor from 'randomcolor';

export const generateColor = () =>
  randomColor({luminosity: 'dark', alpha: 0.5});
