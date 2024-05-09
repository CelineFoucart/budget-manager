const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      mainProcessFile: 'src/background.js',
      builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
      },
      // externals: ['src/utils/tray'],
      experimentalNativeDepCheck: true,
      nodeModulesPath:['./node_modules'],
      asar : false
    }
  }
})
