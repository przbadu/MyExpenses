import {COLORS, lightTheme, darkTheme} from '..';

test('COLORS to return default colors', () => {
  expect(COLORS).toEqual({
    blue: '#28c2ff',
    green: '#5cb85c',
    pink: '#FF3378',
    primary: '#1AA471',
    secondary: '#FF6347',
    white: '#FFFFFF',
  });
});

test('#lightTheme should return light theme color codes', () => {
  expect(lightTheme).toEqual({
    animation: {
      scale: 1,
    },
    colors: {
      accent: '#FF6347',
      backdrop: 'rgba(0, 0, 0, 0.5)',
      background: 'rgb(242, 242, 242)',
      border: 'rgb(216, 216, 216)',
      card: 'rgb(255, 255, 255)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      error: '#B00020',
      lightBlue: '#1AA471',
      notification: 'rgb(255, 59, 48)',
      onSurface: '#000000',
      placeholder: 'rgba(0, 0, 0, 0.54)',
      primary: '#1AA471',
      success: '#007E3C',
      surface: '#ffffff',
      text: 'rgb(28, 28, 30)',
      white: '#FFFFFF',
    },
    dark: false,
    fonts: {
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
    },
    roundness: 4,
  });
});

test('#darkTheme should return light theme color codes', () => {
  expect(darkTheme).toEqual({
    animation: {
      scale: 1,
    },
    colors: {
      accent: '#03dac6',
      backdrop: 'rgba(0, 0, 0, 0.5)',
      background: 'rgb(1, 1, 1)',
      border: 'rgb(39, 39, 41)',
      card: 'rgb(18, 18, 18)',
      disabled: 'rgba(255, 255, 255, 0.38)',
      error: '#CF6679',
      lightBlue: '#4f626e',
      notification: 'rgb(255, 69, 58)',
      onSurface: '#FFFFFF',
      placeholder: 'rgba(255, 255, 255, 0.54)',
      primary: '#1AA471',
      success: '#00C851',
      surface: '#121212',
      text: 'rgb(229, 229, 231)',
      white: '#FFFFFF',
    },
    dark: true,
    fonts: {
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
    },
    mode: 'adaptive',
    roundness: 4,
  });
});
