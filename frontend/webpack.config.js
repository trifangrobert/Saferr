const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".ios.js", ".android.js", ".web.js"]
  }
  const config = await createExpoWebpackConfigAsync(env, argv)
  config.resolve.alias['../Utilities/Platform'] =
    'react-native-web/dist/exports/Platform'
  return config
}