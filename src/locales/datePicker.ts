import { enUS, jaJP, zhCN } from "@mui/x-date-pickers";
export const localeTextConstants = (language: string) => {
  if (language === "zh_CN") {
    return zhCN.components.MuiLocalizationProvider.defaultProps.localeText;
  } else if (language === "en_US") {
    return enUS.components.MuiLocalizationProvider.defaultProps.localeText;
  } else if (language === "ja_JP") {
    return jaJP.components.MuiLocalizationProvider.defaultProps.localeText;
  } else {
    return zhCN.components.MuiLocalizationProvider.defaultProps.localeText;
  }
};

export const adapterLocale = (language: string) => {
  if (language === "zh_CN") {
    return "zh-cn";
  } else if (language === "en_US") {
    return "en";
  } else if (language === "ja_JP") {
    return "ja";
  } else {
    return "zh-cn";
  }
};
