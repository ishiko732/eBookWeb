import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./en_US";
import zhCN from "./zh_CN";
import jaJP from "./ja_JP";
import { defaultLanguage } from "../config/config";
const resources = {
  en_US: {
    translation: enUS,
  },
  zh_CN: {
    translation: zhCN,
  },
  ja_JP: {
    translation: jaJP,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.language || defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

// i18n.on('languageChanged', (e) => {
//   window.location.reload()
// });
export default i18n;
