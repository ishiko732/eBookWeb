import React from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import SelectLanguage from "../../components/Language";
import { Card, CardContent, Chip } from "@mui/material";
import { userStatus } from "../../api/entity/auth";

const statusColor = (active: userStatus) => {
  let color = null;
  switch (active) {
    case userStatus.ENABLED:
      color = "success";
      break;
    case userStatus.EXPIRED:
      color = "error";
      break;
    case userStatus.LOCKED:
      color = "warning";
      break;
    default:
      color = "default";
      break;
  }
  return color;
};

const ConfigBar = (props: any) => {
  const { t } = useTranslation();
  const user = props.user;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom align="center">
        {t("config.config.message")}
      </Typography>
      <Box
        sx={{ margin: "8px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card sx={{ minWidth: "250px" }} variant="outlined">
          <CardContent>
            <Typography gutterBottom>
              {t("config.config.user", { uid: user.id, name: user.name })}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {t("config.config.role", { role: t(`role.${user.role}`) })}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {t("config.config.status")}
              <Chip
                sx={{ margin: "8px" }}
                label={t(`userStatus.${user.active}`)}
                color={statusColor(user.active) as any}
              />
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {t("config.config.phone", { phone: user.phone })}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Divider variant="middle" />
      <SelectLanguage sx={{ "margin-top": "16px" }} />
    </React.Fragment>
  );
};

export default ConfigBar;
