import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from './locales/en/translation.json'
import plTranslation from './locales/pl/translation.json'

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    pl: {
      translation: plTranslation,
    },
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

export default i18n
