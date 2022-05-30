// vue.config.js
module.exports = {
  css: { extract: false },
  lintOnSave:false,
  configureWebpack: config => {
    config.externals = ['vue-i18n']
  }
};
