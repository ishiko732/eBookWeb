import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { loginUser } from "../../api/auth";
import {
  Box,
  Chip,
  Paper,
  Typography,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import Title from "../../components/Title";
import request from "../../config/request";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useSnackbar } from "notistack";
import OnlineDataTable from "./OnlineDataTable";
import { OnlineUsers } from "../../api/models";

const OnlineControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<OnlineUsers>({
    cnt: "N/A",
    users: [],
  });
  const [restart, setRestart] = React.useState(false);
  const { t } = useTranslation();
  React.useEffect(() => {
    if (status) {
      loginUser()
        .then((res) => {
          setMessage(res.data);
          enqueueSnackbar(t("api.success"), { variant: "success" });
          console.log(res.data);
        })
        .catch((err) => {
          enqueueSnackbar(t("api.error"), { variant: "error" });
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  React.useEffect(() => {
    if (restart) {
      loginUser()
        .then((res) => {
          setMessage(res.data);
          enqueueSnackbar(t("api.success"), { variant: "success" });
          console.log(res.data);
        })
        .catch((err) => {
          enqueueSnackbar(t("api.error"), { variant: "error" });
          console.log(err);
        });
      setRestart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);
  const ClickOp = (
    e: { stopPropagation: () => void },
    row: any,
    href: string
  ) => {
    e.stopPropagation();
    request
      .post(href)
      .then((res) => {
        enqueueSnackbar(`用户${row.name || "N/A"}下线成功!`, {
          variant: "success",
        });
        setMessage((pre) => {
          return {
            cnt: (pre.cnt as number) - 1,
            users: message.users.filter((user) => user !== row),
          };
        });
      })
      .catch((err) => {
        enqueueSnackbar(`用户${row.name || "N/A"}下线失败!`, {
          variant: "error",
        });
      });
  };

  return (
    <RequiredRole
      user={props.user}
      requireRole={[role.SUPERADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "500",
          }}
        >
          <Title>{t("system.online.online")}</Title>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography color="text.secondary">
              {t("system.online.number")}
            </Typography>
            <Chip label={message.cnt} color={"success"} />
            <Divider orientation="vertical" flexItem />
            <Tooltip title={t("system.online.restart")}>
              <IconButton onClick={() => setRestart(true)}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider light flexItem sx={{ margin: "8px" }} />
          <OnlineDataTable ClickOp={ClickOp} message={message} />
        </Paper>
      </Box>
    </RequiredRole>
  );
};

export default OnlineControl;
