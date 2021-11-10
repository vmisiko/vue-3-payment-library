import VueI18n from 'vue-i18n'
import Vue from 'vue'
import en from '@/lang/en.json'

Vue.use(VueI18n)
export const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: { en }// set locale messages
})