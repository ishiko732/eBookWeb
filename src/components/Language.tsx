import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export default function SelectLanguage(props: any) {
  const { t, i18n } = useTranslation();
  const languages = Object.keys(i18next.services.resourceStore.data);
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.language);

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentLanguage(event.target.value as string);
    i18n.changeLanguage(event.target.value);
    localStorage.language = event.target.value;
  };
  return (
    <Box sx={{ minWidth: 120 }} {...props}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("transfer.language")}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentLanguage}
          label={t("transfer.language")}
          onChange={handleChange}
        >
          {languages.map((language) => {
            return (
              <MenuItem value={language} key={language}>
                {t(`transfer.` + language)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
