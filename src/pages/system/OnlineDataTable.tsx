import { Chip, Stack, Button, Box } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { role, userStatus } from "../../api/entity/auth";
import { userStatusColor } from "../../config/config";
import localeTextConstants from "../../locales/DataGrid";

const OnlineDataTable = ({
  message,
  ClickOp,
}: {
  message: any;
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
  );
};

export default OnlineDataTable;
