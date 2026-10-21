const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const path = require('path');

const skiaModulePath = path.resolve(__dirname, 'node_modules/@shopify/react-native-skia/lib/module/index.js');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resetCache: true,
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@shopify/react-native-skia') {
        return {
          filePath: skiaModulePath,
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config)
);