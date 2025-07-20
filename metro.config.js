const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const baseConfig = mergeConfig(getDefaultConfig(__dirname), {
  // Додаткові опції, якщо є
});

module.exports = wrapWithReanimatedMetroConfig(baseConfig);
