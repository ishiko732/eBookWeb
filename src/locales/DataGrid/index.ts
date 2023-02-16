import {zhCN,jaJP,enUS } from '@mui/x-data-grid';
const localeTextConstants = (language: string) => {
  if (language === "zh_CN") {
    return zhCN.components.MuiDataGrid.defaultProps.localeText;
  } else if (language === "en_US") {
    return enUS.components.MuiDataGrid.defaultProps.localeText;
  } else if (language === "ja_JP") {
    return jaJP.components.MuiDataGrid.defaultProps.localeText;
  } else {
    return zhCN.components.MuiDataGrid.defaultProps.localeText;
  }
};
export default localeTextConstants;
