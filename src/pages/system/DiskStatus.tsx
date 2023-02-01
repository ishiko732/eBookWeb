import { Chip, Grid, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { BasicPieChart, pieData } from "../../components/BasicPieChart";
import Title from "../../components/Title";
import { healthStatusColor } from "../../config/config";
import getfilesize from "../../utils/getSize";

const DiskStatus = (props: any) => {
  const { message } = props;
  const { t } = useTranslation();
  const use = t("system.diskSpace.use");
  const threshold = t("system.diskSpace.threshold");
  const free = t("system.diskSpace.free");
  const pieData: pieData[] = [
    {
      name: use,
      value: message?.details?.total - message?.details?.free,
      color: "#8884d8",
    },
    {
      name: free,
      value: message?.details?.free,
      color: "#82ca9d",
    },
    {
      name: threshold,
      value: message?.details?.threshold,
      color: "#ff0000",
    },
  ];
  return (
    <React.Fragment>
      <Title>{t("system.diskSpace.run")}</Title>
      <Grid
        container
        // columnSpacing={{ xs: 4, md: 1 }}
        spacing={2}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={6}>
          <Typography color="text.secondary">
            {t("system.status", { name: "Disk" })}
          </Typography>
          <Chip
            label={t(`system.${message?.status || "DOWN"}`)}
            color={healthStatusColor(message?.status || "DOWN")}
          />
          <Typography color="text.secondary" mt={2}>
            {t("system.diskSpace.path")}
          </Typography>
          <Tooltip title={message?.details?.path?.replace(`\\\\`, `\\`) || ""}>
            <Chip label={message?.details?.path?.replace(`\\\\`, `\\`) || ""} />
          </Tooltip>
        </Grid>
        {/* <Divider orientation="vertical"  /> */}
        <Grid item xs={4}>
          <BasicPieChart
            data={pieData}
            width={300}
            height={200}
            cx={50}
            cy={50}
            outerRadius={50}
            isLabel={true}
            isTooltip={true}
            tipfunc={getfilesize}
            isLegend={true}
            legentd_verticalAlign="top"
            legentd_align="center"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default DiskStatus;
