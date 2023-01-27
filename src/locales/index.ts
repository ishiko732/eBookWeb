import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./en_US";
import zhCN from "./zh_CN";
import jaJP from "./ja_JP"
const resources = {
  en_US: {
    translation: enUS,
  },
  zh_CN: {
    translation: zhCN,
  },
  ja_JP:{
    translation: jaJP,
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh_CN",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
