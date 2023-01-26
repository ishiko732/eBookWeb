import React from "react";
import { delete_token } from "../../config/token";
import { logout } from "../../api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
export default function UserMenu(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Button key="one">配置</Button>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          logout()
            .then((res) => {
              delete_token();
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            })
            .catch((err) => {
              delete_token();
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            });
        }}
      >
        {t("logout")}
      </Button>
    </React.Fragment>
  );
}
