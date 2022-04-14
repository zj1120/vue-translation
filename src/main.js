import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const SHA256 = require('crypto-js/sha256')
Vue.use(VueI18n)
const translationData = require('./assets/i18n/translationFile.yml')
const locale = window.localStorage.getItem('lang') || 'zh'
function getYmlData() {
  const enObj = {}
  const cnObj = {}

  Object.entries(translationData).forEach(function([key, val]) {
    const enStr = val.en
    const cnStr = val.zh
    enObj[key] = enStr || ''
    cnObj[key] = cnStr || ''
  })

  return {
    enObj,
    cnObj
  }
}

const i18n = new VueI18n({
  locale,
  messages: {
    zh: Object.assign(getYmlData().cnObj, zhLocale),
    en: Object.assign(getYmlData().enObj, enLocale)
  }
})

if (!Vue.prototype.$spt) {
  Vue.prototype.$spt = i18n.$spt = function(str, ...args) {
    const val = i18n.t(SHA256(str), ...args)
    return val || str
  }
}

// 兼容elementUI $t写法
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

const init = Vue.prototype._init
Vue.prototype._init = function(args) {
  init.call(this, {
    i18n,
    ...args
  })
}



new Vue({
  render: h => h(App),
}).$mount('#app')
