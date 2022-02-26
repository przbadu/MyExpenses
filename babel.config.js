module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-typescript'],
  ],
  // Setup for watermelondb
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
  ],
  // react-native-paper setup to only load module that we use
  // this helps us keep smaller bundle size
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
