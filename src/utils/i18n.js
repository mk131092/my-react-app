import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../locales/en/translation.json";
import translationHI from "../locales/hi/translation.json";
import translationAR from "../locales/ar/translation.json";
import translationFA from "../locales/fa/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationSW from "../locales/sw/translation.json";
import translationDE from "../locales/de/translation.json";
import translationES from "../locales/es/translation.json";
import translationTA from "../locales/ta/translation.json";
import translationTE from "../locales/te/translation.json";
import translationPA from "../locales/pa/translation.json";
import translationBL from "../locales/bl/translation.json";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Block from "quill/blots/block";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },

  hi: {
    translation: translationHI,
  },
  ar: {
    translation: translationAR,
  },

  fa: {
    translation: translationFA,
  },
  ru: {
    translation: translationRU,
  },

  sw: {
    translation: translationSW,
  },
  de: {
    translation: translationDE,
  },
  es: {
    translation: translationES,
  },
  ta: {
    translation: translationTA,
  },
  te: {
    translation: translationTE,
  },
  pa: {
    translation: translationPA,
  },
  bl: {
    translation: translationBL,
  },
};
const language = useLocalStorage("language", "get");
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: language,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    react: {
      wait: true,
    },
  });

export default i18n;
