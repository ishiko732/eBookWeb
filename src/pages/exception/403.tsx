import { useTranslation } from "react-i18next";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
const primary = purple[500]; // #f44336

export default function Forbidden() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: "white" }}>
        403
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        {t("error.403.forbidden")}
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>
        {t("error.403.Back Page")}
      </Button>
    </Box>
  );
}
