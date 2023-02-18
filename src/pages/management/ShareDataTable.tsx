import localeTextConstants from "../../locales/DataGrid";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { Box, Button, Chip, Stack } from "@mui/material";
import * as React from "react";
import { shareBook } from "../../api/models";

const columns = ({ t, ClickOp }: any): GridColDef[] => {
  return [
    {
      field: "id",
      headerName: t("management.review.sharebookField.id") as string,
      width: 90,
      sortable: true,
    },
    {
      field: "review",
      headerName: t("management.review.sharebookField.status") as string,
      width: 150,
      sortable: true,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return (
          <Chip
            label={params.value}
            color={
              (t(
                `management.review.color.${params.row.review.status}`
              ) as any) || "info"
            }
          />
        );
      },
      valueGetter(params) {
        return t(`management.review.status.${params.value.status || "NOT"}`);
      },
    },
    {
      field: "file",
      headerName: t("management.media.fileName") as string,
      width: 250,
      sortable: true,
      valueGetter(params) {
        return params.value.filename;
      },
    },
    {
      field: "browse",
      headerName: t("management.review.sharebookField.browse") as string,
      width: 90,
      sortable: true,
    },
    {
      field: "love",
      headerName: t("management.review.sharebookField.love") as string,
      width: 90,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: t("management.review.sharebookField.createdAt") as string,
      width: 180,
      valueGetter(params) {
        return params.row.review.createdAt;
      },
    },
    {
      field: "updateAt",
      headerName: t("management.review.sharebookField.updateAt") as string,
      width: 180,
      valueGetter(params) {
        return params.row.review.updateAt;
      },
    },
    {
      field: "op",
      headerName: t("management.review.op") as string,
      width: 340,
      renderCell(params: GridRenderCellParams<any, any, any>) {
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="info"
              onClick={(e) => ClickOp(e, params.row, "viewReview")}
            >
              {t(`management.review.view`, {
                field: t(`management.review.sharebookField.check`),
              })}
            </Button>
          </Stack>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];
};
const ShareDataTable = ({
  isLoading,
  message,
  setMessage,
  ClickOp,
}: {
  isLoading: boolean;
  message: shareBook[];
  setMessage: React.Dispatch<React.SetStateAction<shareBook[]>>;
  ClickOp: Function;
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ height: 640, width: "100%" }}>
      <DataGrid
        // autoHeight
        rows={message}
        columns={columns({ t: t, ClickOp: ClickOp })}
        pageSize={10}
        rowsPerPageOptions={[5]}
        experimentalFeatures={{ newEditingApi: true }}
        loading={isLoading}
        localeText={localeTextConstants(localStorage.language)}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: "review",
                  operatorValue: "equals",
                  value: t(`management.review.status.WAIT`),
                },
              ],
            },
          },
        }}
      />
    </Box>
  );
};
export default ShareDataTable;
