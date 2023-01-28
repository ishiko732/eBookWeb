import React from "react";
import { delete_token } from "../../config/token";
import { logout } from "../../api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AlertDialog from "../../components/AlertDialog";

export default function UserMenu(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  function handleOpen(isOpen: boolean, status?: boolean) {
    setOpen(isOpen);
    if (status) {
      Logout();
    }
  }
  const logout_op = () => {
    delete_token();
    localStorage.removeItem("list_data");
    localStorage.removeItem("remember");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const Logout = () => {
    logout()
      .then((res) => {
        logout_op();
      })
      .catch((err) => {
        logout_op();
      });
  };
  return (
    <React.Fragment>
      <Button key="one">{t("config.config")}</Button>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          handleOpen(true);
        }}
      >
        {t("config.logout.logout")}
      </Button>
      <AlertDialog
        open={open}
        onChange={handleOpen}
        title={t("config.logout.title")}
        text={t("config.logout.text")}
        disagree={t("config.logout.disagree")}
        agree={t("config.logout.agree")}
      />
    </React.Fragment>
  );
}
