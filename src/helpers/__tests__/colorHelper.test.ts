import {generateColor, generateColors, hexToRGBA} from '..';

describe('#generateColor', () => {
  test('it should return random color', async () => {
    const color = generateColor();
    expect(color).toBeDefined();
    expect(typeof color).toBe('string');
  });
});

describe('#generateColors', () => {
  test('it should return random colors', async () => {
    const colors = generateColors();
    expect(colors).toBeDefined();
    expect(typeof colors).toBe('object');
  });

  test('it should generate 10 random colors', async () => {
    const colors = generateColors();
    expect(colors.length).toBe(10);
  });
});

describe('#hexToRGBA', () => {
  test('it should return rgba color', async () => {
    const color = hexToRGBA('#ffffff', 0.5);
    expect(color).toBeDefined();
    expect(typeof color).toBe('string');
    expect(color).toBe('rgba(255, 255, 255, 0.5)');
  });

  test('it should return rgba color with 0.2 opacity', async () => {
    const color = hexToRGBA('#ffffff', 0.2);
    expect(color).toBeDefined();
    expect(color).toBe('rgba(255, 255, 255, 0.2)');
  });
});
