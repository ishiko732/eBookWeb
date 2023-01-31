import { Chip, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";

export interface system_message {
  cpu: string;
  os: string;
  version: string;
  macos: boolean;
  windows: boolean;
  linux: boolean;
}

const Information = ({ message }: { message: system_message }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Title>{t("system.message")}</Title>

      <Typography color="text.secondary">
        <Grid container spacing={3}>
          <Grid item>
            {t("system.OS")}{" "}
            <Chip label={message.os} color="primary" variant="outlined" />
          </Grid>
          <Grid item>
            {t("system.version")}
            <Chip label={message.version} color="primary" variant="outlined" />
          </Grid>
          <Grid item>
            {t("system.CPU")}
            <Chip label={message.cpu} color="primary" variant="outlined" />
          </Grid>
        </Grid>
      </Typography>
    </React.Fragment>
  );
};

export default Information;
