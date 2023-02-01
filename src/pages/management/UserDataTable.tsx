import { role, userStatus } from "../../api/entity/auth";
import { userStatusColor } from "../../config/config";
import localeTextConstants from "../../locales/DataGrid";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import {
  Chip,
  Stack,
  Button,
  Box,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { User } from "../../api/models";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import React from "react";

export const SelectUserStatus = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {(Object.keys(userStatus) as (keyof typeof userStatus)[]).map((key) => {
        return (
          <MenuItem value={t(`userStatus.${key}`)}>
            <Chip
              label={t(`userStatus.${key}`)}
              color={userStatusColor(key as userStatus) as any}
            />
          </MenuItem>
        );
      })}
    </React.Fragment>
  );
};

const UserDataTable = ({
  isLoading,
  message,
  ClickOp,
}: {
  isLoading: boolean;
  message: User[];
  ClickOp: Function;
}) => {
  const { t } = useTranslation();
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
        return (
          <FormControl fullWidth={true} variant="standard">
            <Select
              // sx={{
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
              labelId="select-label-role"
              id="select-label-role"
              value={params.row.role}
              onChange={(e) => {
                ClickOp(e, params.row, "role");
              }}
            >
              {(Object.keys(role) as (keyof typeof role)[]).map((key) => {
                return <MenuItem value={key}>{t(`role.${key}`)}</MenuItem>;
              })}
            </Select>
          </FormControl>
        );
      },
      valueGetter(params) {
        return t(`role.${params.value || role.TEMP}`);
      },
      width: 150,
    },
    {
      field: "active",
      headerName: (t("config.config.status") as string).replace(":", ""),
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return (
          <FormControl variant="standard">
            <Select
              //   sx={{
              //     display: "flex",
              //     justifyContent: "center",
              //     alignItems: "center",
              //   }}
              labelId="select-label-active"
              id="select-label-active"
              value={params.row.active}
              onChange={(e) => {
                ClickOp(e, params.row, "active");
              }}
            >
              {(Object.keys(userStatus) as (keyof typeof userStatus)[]).map(
                (key) => {
                  return (
                    <MenuItem value={key}>
                      <Chip
                        label={t(`userStatus.${key}`)}
                        color={userStatusColor(key as userStatus) as any}
                      />
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>
        );
      },
      valueGetter(params) {
        return t(`userStatus.${params.value || userStatus.EXPIRED}`);
      },
      width: 130,
    },
    {
      field: "password",
      headerName: t("auth.register.password") as string,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return (
          <Tooltip title={params.value}>
            <IconButton>
              <VerifiedUserIcon color="success" />
            </IconButton>
          </Tooltip>
        );
      },
      width: 80,
      filterable: false,
      sortable: false,
    },
    {
      field: "createdAt",
      headerName: t("management.user.createDate") as string,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return <Chip label={params.value} variant="outlined" />;
      },
      width: 180,
    },
    {
      field: "updateAt",
      headerName: t("management.user.updateDate") as string,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return <Chip label={params.value} variant="outlined" />;
      },
      width: 180,
    },
  ];
  return (
    <Box sx={{ height: 630, width: "100%" }}>
      <DataGrid
        // autoHeight
        rows={message}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        // checkboxSelection
        disableSelectionOnClick
        loading={isLoading}
        localeText={localeTextConstants(localStorage.language)}
        initialState={{
          sorting: {
            sortModel: [
              { field: "id", sort: "asc" },
              { field: "createdAt", sort: "desc" },
              { field: "updateAt", sort: "desc" },
            ],
          },
        }}
      />
    </Box>
  );
};
export default UserDataTable;
