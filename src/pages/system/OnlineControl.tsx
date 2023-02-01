import { useTranslation } from "react-i18next";
import { role, userStatus } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { loginUser } from "../../api/auth";
import {
  Box,
  Chip,
  Paper,
  Typography,
  Divider,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import Title from "../../components/Title";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import localeTextConstants from "../../locales/DataGrid";
import { userStatusColor } from "../../config/config";
import request from "../../config/request";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useSnackbar } from "notistack";

interface onlineUsers {
  cnt: number | string;
  users: {
    name: string;
    id: number;
    phone: string;
    role: role;
    active: userStatus;
    links: [];
  }[];
}
const OnlineControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<onlineUsers>({
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
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [status]);
  React.useEffect(() => {
    if (restart) {
      loginUser()
        .then((res) => {
          setMessage(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setRestart(false);
    }
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
  const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 90, sortable: true },
    {
      field: "name",
      headerName: t("auth.register.name") as string,
      width: 120,
    },
    {
      field: "phone",
      headerName: t("auth.register.phone") as string,
      width: 150,
      sortable: false,
    },
    {
      field: "role",
      headerName: t("config.config.role").replace(":{{role}}", "") as string,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return t(`role.${params.value || role.TEMP}`);
      },
    },
    {
      field: "active",
      headerName: (t("config.config.status") as string).replace(":", ""),
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return (
          <Chip
            label={t(`userStatus.${params.value || userStatus.EXPIRED}`)}
            color={userStatusColor(params.value || userStatus.EXPIRED) as any}
          />
        );
      },
    },
    {
      field: "links",
      headerName: t("system.online.op") as string,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return (
          <Stack direction="row" spacing={2}>
            {params.value?.map((v: any) => {
              return (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    ClickOp(e, params.row, v.href);
                  }}
                >
                  {t(`system.online.links.${v.rel}`)}
                </Button>
              );
            })}
          </Stack>
        );
      },
      width: 200,
      sortable: false,
    },
  ];
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
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              // autoHeight
              rows={message.users}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              localeText={localeTextConstants(localStorage.language)}
              initialState={{
                sorting: {
                  sortModel: [{ field: "id", sort: "asc" }],
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </RequiredRole>
  );
};

export default OnlineControl;
