module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // Setup for watermelondb
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ],
  // react-native-paper setup to only load module that we use
  // this helps us keep smaller bundle size
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
