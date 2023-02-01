import { GRID_DEFAULT_LOCALE_TEXT_EN_US } from "./localeTextConstants_en_US";
import { GRID_DEFAULT_LOCALE_TEXT_JA_JP } from "././localeTextConstants_ja_JP";
import { GRID_DEFAULT_LOCALE_TEXT_ZH_CN } from "././localeTextConstants_zh_CN";
const localeTextConstants = (language: string) => {
  if (language === "zh_CN") {
    return GRID_DEFAULT_LOCALE_TEXT_ZH_CN;
  } else if (language === "en_US") {
    return GRID_DEFAULT_LOCALE_TEXT_EN_US;
  } else if (language === "ja_JP") {
    return GRID_DEFAULT_LOCALE_TEXT_JA_JP;
  } else {
    return GRID_DEFAULT_LOCALE_TEXT_ZH_CN;
  }
};
export default localeTextConstants;
