import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
//@ts-expect-error No typescript definitions
import Cache from 'i18next-localstorage-cache'

import enTranslation from './locales/en/translation.json'
import plTranslation from './locales/pl/translation.json'

void i18n
  .use(Cache)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      pl: {
        translation: plTranslation,
      },
    },
    supportedLngs: ['en', 'pl'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
