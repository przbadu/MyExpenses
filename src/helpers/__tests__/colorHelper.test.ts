import {generateColor, generateColors, hexToRGBA} from '..';

describe('#generateColor', () => {
  test('it should return random color', () => {
    const color = generateColor();
    expect(color).toBeDefined();
    expect(typeof color).toBe('string');
  });
});

describe('#generateColors', () => {
  test('it should return random colors', () => {
    const colors = generateColors();
    expect(colors).toBeDefined();
    expect(typeof colors).toBe('object');
  });

  test('it should generate 10 random colors', () => {
    const colors = generateColors();
    expect(colors.length).toBe(10);
  });
});

describe('#hexToRGBA', () => {
  test('it should return rgba color', () => {
    const color = hexToRGBA('#ffffff', 0.5);
    expect(color).toBeDefined();
    expect(typeof color).toBe('string');
    expect(color).toBe('rgba(255, 255, 255, 0.5)');
  });

  test('it should return rgba color with 0.2 opacity', () => {
    const color = hexToRGBA('#ffffff', 0.2);
    expect(color).toBeDefined();
    expect(color).toBe('rgba(255, 255, 255, 0.2)');
  });
});
