import { useTranslation } from "react-i18next";
import { role, userStatus } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { getUsers } from "../../api/user";
import {
  Box,
  Chip,
  Paper,
  Typography,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import Title from "../../components/Title";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useSnackbar } from "notistack";
import UserDataTable from "./UserDataTable";
import { User } from "../../api/models";
import { updateRole, updateStatus } from "../../api/auth";
import dayjs from "dayjs";
import { defaultDateFormat } from "../../config/config";

const UserControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [status, setStatus] = React.useState(false);
  const [restart, setRestart] = React.useState(false);
  const [message, setMessage] = React.useState<User[]>([]);
  const [isLoading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (status) {
      setLoading(true);
      getUsers()
        .then((res) => {
          setMessage(res.data);
          enqueueSnackbar(t("api.success"), { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar(t("api.error"), { variant: "error" });
          console.log(err);
        });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  React.useEffect(() => {
    if (restart) {
      setLoading(true);
      getUsers()
        .then((res) => {
          setMessage(res.data);
          enqueueSnackbar(t("api.success"), { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar(t("api.error"), { variant: "error" });
          console.log(err);
        });
      setRestart(false);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  const ClickOp = (event: SelectChangeEvent, row: any, info: string) => {
    const index = message.indexOf(row);
    console.log("uid");
    console.log(message[index].id);
    setLoading(true);
    if (info === "role") {
      updateRole({
        uid: message[index].id,
        role: event.target.value as role,
      })
        .then((res) => {
          console.log(res);
          enqueueSnackbar(res.data, { variant: "success" });
          setMessage((pre) => {
            pre[index].role = event.target.value as role;
            pre[index].updateAt = dayjs().format(defaultDateFormat);
            return [...pre];
          });
        })
        .catch((err) => {
          enqueueSnackbar(err.data, { variant: "error" });
          console.log(err);
        });
    } else if (info === "active") {
      updateStatus({
        uid: message[index].id,
        status: event.target.value as userStatus,
      })
        .then((res) => {
          enqueueSnackbar(res.data, { variant: "success" });
          setMessage((pre) => {
            pre[index].active = event.target.value as userStatus;
            pre[index].updateAt = dayjs().format(defaultDateFormat);
            return [...pre];
          });
        })
        .catch((err) => {
          enqueueSnackbar(err?.data, { variant: "error" });
          console.log(err);
        });
    }
    setLoading(false);
  };
  return (
    <RequiredRole
      user={props.user}
      requireRole={[role.SUPERADMIN, role.ADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "630",
          }}
        >
          <Title>{t("management.user.title")}</Title>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography color="text.secondary">
              {t("management.user.number")}
            </Typography>
            <Chip label={message.length} color={"success"} />
            <Divider orientation="vertical" flexItem />
            <Tooltip title={t("system.online.restart")}>
              <IconButton onClick={() => setRestart(true)}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider light flexItem sx={{ margin: "8px" }} />
          <UserDataTable
            ClickOp={ClickOp}
            message={message}
            isLoading={isLoading}
            setMessage={setMessage}
            loginUser={props.user}
          />
        </Paper>
      </Box>
    </RequiredRole>
  );
};

export default UserControl;
