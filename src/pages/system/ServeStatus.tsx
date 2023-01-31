import { Chip, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
type HealthStatus = "UP" | "DOWN";
export const statusColor = (status: HealthStatus) => {
  return status === "UP" ? "success" : "error";
};

const ServeStatus = ({ health }: { health: any }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Title>{t("system.status", { name: "服务" })}</Title>
      <Grid
        container
        spacing={2}
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <Grid item xs={6}>
          <Grid
            container
            spacing={2}
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {t("system.status", { name: "API" })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Chip
                label={t(`system.${health?.status || "DOWN"}`)}
                color={statusColor(health?.status || "DOWN")}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            spacing={2}
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {t("system.status", { name: "MySQL" })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Chip
                label={t(`system.${health?.components?.db?.status || "DOWN"}`)}
                color={statusColor(health?.components?.db?.status || "DOWN")}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            spacing={2}
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {t("system.status", { name: "Redis" })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Chip
                label={t(
                  `system.${health?.components?.redis?.status || "DOWN"}`
                )}
                color={statusColor(health?.components?.redis?.status || "DOWN")}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            spacing={2}
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {t("system.status", { name: "Mongo" })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Chip
                label={t(
                  `system.${health?.components?.mongo?.status || "DOWN"}`
                )}
                color={statusColor(health?.components?.mongo?.status || "DOWN")}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ServeStatus;
