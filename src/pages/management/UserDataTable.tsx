import { role, updatePasswordVo, userStatus } from "../../api/entity/auth";
import { userStatusColor } from "../../config/config";
import localeTextConstants from "../../locales/DataGrid";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import {
  Chip,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import * as React from "react";
import { User } from "../../api/models";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { updatePassword } from "../../api/auth";
import { useSnackbar } from "notistack";
import UpdatePassword from "./UpdatePassword";
import { matchIsValidTel } from "mui-tel-input";
import { updatePhone } from "../../api/user";

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
  setMessage,
  loginUser,
}: {
  isLoading: boolean;
  message: User[];
  ClickOp: Function;
  setMessage: React.Dispatch<React.SetStateAction<User[]>>;
  loginUser: User;
}) => {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [selectUser, setSelectUser] = React.useState<User | null>(null);
  const handleClickOpen = (row: User) => {
    setSelectUser(row);
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    password?: updatePasswordVo
  ) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      if (password && selectUser) {
        updatePassword(password)
          .then((res: any) => {
            enqueueSnackbar(res?.msg, { variant: "success" });
            setMessage((pre) => {
              const index = pre.indexOf(selectUser as User);
              pre[index].password = t("management.user.protected");
              return [...pre];
            });
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar(err?.msg, { variant: "success" });
          });
      }
      setSelectUser(null);
    }
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
      editable: true,
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
            <IconButton onClick={() => handleClickOpen(params.row)}>
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
  const processRowUpdate = async (newRow: User, oldRow: User) => {
    if (oldRow.phone === newRow.phone) {
      return { ...newRow, isNew: false };
    }

    const phone =
      (newRow.phone as string)[0] === "+"
        ? newRow.phone
        : t(`auth.register.${i18n.language}`) + newRow.phone;
    const invalid = !matchIsValidTel(phone);
    let success = false;
    if (invalid) {
      enqueueSnackbar(t("auth.valid.phone"), { variant: "error" });
    } else {
      await updatePhone(newRow.name, phone)
        .then((res) => {
          enqueueSnackbar(t("api.opt_success"), {
            variant: "success",
          });
          success = true;
        })
        .catch((err) => {
          enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
            variant: "error",
          });
        });
    }
    return { ...newRow, isNew: success, phone: success ? phone : oldRow.phone };
  };
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        // autoHeight
        rows={message}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        // checkboxSelection
        disableSelectionOnClick
        loading={isLoading}
        localeText={localeTextConstants(localStorage.language)}
        processRowUpdate={processRowUpdate}
        initialState={{
          sorting: {
            sortModel: [
              { field: "id", sort: "asc" },
              { field: "createdAt", sort: "desc" },
              { field: "updateAt", sort: "desc" },
            ],
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <UpdatePassword
        open={open}
        handleClose={handleClose}
        updateUid={selectUser?.id || -1}
        loginUser={loginUser}
      />
    </Box>
  );
};
export default UserDataTable;
