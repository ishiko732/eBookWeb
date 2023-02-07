import localeTextConstants from "../../locales/DataGrid";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { Box, Button, Stack } from "@mui/material";
import * as React from "react";
import { file } from "../../api/models";

const MediaDataTable = ({
  isLoading,
  message,
  ClickOp,
  setMessage,
}: {
  isLoading: boolean;
  message: file[];
  ClickOp: Function;
  setMessage: React.Dispatch<React.SetStateAction<file[]>>;
}) => {
  const { t } = useTranslation();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("management.media.fileId") as string,
      width: 90,
      sortable: true,
    },
    // {
    //   field: "fid",
    //   headerName: t("management.media.fid") as string,
    //   width: 90,
    //   sortable: true,
    // },
    {
      field: "filename",
      headerName: t("management.media.fileName") as string,
      width: 300,
    },
    {
      field: "fsId",
      headerName: t("management.media.fsId") as string,
      width: 260,
    },
    {
      field: "md5",
      headerName: "MD5",
      width: 300,
    },
    {
      field: "links",
      headerName: t("system.online.op") as string,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        // console.log(params.row)
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="info"
              onClick={(e) => {
                ClickOp(e, params.row, "Download");
              }}
            >
              {t(`management.media.links.download`)}
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={(e) => {
                ClickOp(e, params.row, "Update");
              }}
            >
              {t(`management.media.links.update`)}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                ClickOp(e, params.row, "Delete");
              }}
            >
              {t(`management.media.links.delete`)}
            </Button>
          </Stack>
        );
      },
      width: 300,
      sortable: false,
      filterable: false,
    },
  ];
  return (
    <Box sx={{ height: 640, width: "100%" }}>
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
              { field: "fid", sort: "asc" },
            ],
          },
        }}
      />
    </Box>
  );
};
export default MediaDataTable;
