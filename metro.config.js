// Default Expo Metro config. Expo CLI automatically applies the `@/*`
// path alias from tsconfig.json, so no extra resolver config is needed here.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
