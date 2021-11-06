import randomColor from 'randomcolor';

export const generateColor = () => randomColor({luminosity: 'dark'});

export const generateColors = () => {
  let initialColors: string[] = [];
  for (let i = 0; i < 10; i++) {
    initialColors.push(generateColor());
  }
  return initialColors;
};
