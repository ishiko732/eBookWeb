import React from "react";
import {
  get_access_token,
  get_refresh_token,
  delete_token,
} from "../../config/token";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (Object.keys(get_access_token()).length === 0) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      hello
      <div>{get_access_token()}</div>
      <div>{get_refresh_token()}</div>
      <div>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            delete_token();

            navigate("/login");
          }}
        >
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}
