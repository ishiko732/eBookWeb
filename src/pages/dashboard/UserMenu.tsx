import React from "react";
import { logout } from "../../api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AlertDialog from "../../components/AlertDialog";
import { logOut } from "../../config/logOut";
export default function UserMenu(props: any): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const { setOpenConfig, setAnchorEl } = props;

  function handleOpen(isOpen: boolean, status?: boolean) {
    setOpen(isOpen);
    if (status !== undefined) {
      if (status) {
        Logout();
      }
      setAnchorEl(null);
    }
  }

  const Logout = () => {
    logout()
      .then((res) => {
        logOut();
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      })
      .catch((err) => {
        logOut();
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      });
  };
  return (
    <React.Fragment>
      <Button
        key="menu.config"
        onClick={() => {
          setOpenConfig(true);
        }}
      >
        {t("config.config")}
      </Button>
      <Button
        key="menu.logout"
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
