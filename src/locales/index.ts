import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./en_US";
import zhCN from "./zh_CN";
import jaJP from "./ja_JP";
import { defaultLanguage } from "../config/config";
import queryString from "query-string";

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

export const languages = ["zh_CN", "ja_JP", "en_US"];
export const language = () => {
  const parsed = queryString.parse(window.location.search);
  const language = parsed["lang"] || parsed["language"] || parsed["i18n"];
  if (language != null && languages.indexOf(language as string) !== -1) {
    localStorage.language = language;
    return language as string;
  } else {
    return localStorage.language || defaultLanguage;
  }
};
i18n.use(initReactI18next).init({
  resources,
  lng: language(),
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

// i18n.on('languageChanged', (e) => {
//   window.location.reload()
// });
export default i18n;
