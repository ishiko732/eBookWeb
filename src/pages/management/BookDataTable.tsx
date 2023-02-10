import localeTextConstants from "../../locales/DataGrid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { Box, Chip, Tooltip } from "@mui/material";
import * as React from "react";
import { book, bookKeyword, bookType } from "../../api/models";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { updateBook } from "../../api/book";
import { useSnackbar } from "notistack";
// const keywordsToString = (keywords: bookKeyword[]) => {
//   let ret = "";
//   keywords.forEach((keyword) => {
//     ret += "," + keyword;
//   });
//   return ret.substring(1);
// };

const BookDataTable = ({
  isLoading,
  message,
  setMessage,
  selectedId,
  setSelectedId,
}: {
  isLoading: boolean;
  message: book[];
  setMessage: React.Dispatch<React.SetStateAction<book[]>>;
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("management.book.bookField.id") as string,
      width: 90,
      sortable: true,
    },
    {
      field: "mid",
      headerName: t("management.book.bookField.mid") as string,
      width: 60,
      sortable: false,
      renderCell(params) {
        return (
          <Tooltip title={params.row.mid}>
            <FolderOpenIcon />
          </Tooltip>
        );
      },
    },
    {
      field: "types",
      headerName: t("management.book.bookField.types") as string,
      width: 300,
      renderCell(params) {
        return (
          <React.Fragment>
            {(params.row.types as bookType[]).map((type) => {
              return <Chip label={type.type} />;
            })}
          </React.Fragment>
        );
      },
    },
    {
      field: "author",
      headerName: t("management.book.bookField.author") as string,
      width: 250,
      editable: true,
    },
    {
      field: "title",
      headerName: t("management.book.bookField.title") as string,
      width: 250,
      editable: true,
    },
    {
      field: "subject",
      headerName: t("management.book.bookField.subject") as string,
      width: 250,
      editable: true,
    },
    {
      field: "keywords",
      headerName: t("management.book.bookField.keywords") as string,
      width: 300,
      renderCell(params) {
        return (
          <React.Fragment>
            {(params.row.keywords as bookKeyword[]).map((keyword) => {
              return <Chip label={keyword.keyword} />;
            })}
          </React.Fragment>
        );
      },
      // renderEditCell(params) {
      //   return params.row.keywords
      // },
    },
    {
      field: "creator",
      headerName: t("management.book.bookField.creator") as string,
      width: 200,
      editable: true,
    },
    {
      field: "creationDate",
      headerName: t("management.book.bookField.creationDate") as string,
      width: 200,
      editable: true,
    },
  ];

  const processRowUpdate = async (newRow: book, oldRow: book) => {
    if (oldRow === newRow) {
      return { ...newRow, isNew: false };
    }
    let success = true;
    await updateBook(newRow)
      .then((res) => {
        enqueueSnackbar(t("api.opt_success"), {
          variant: "success",
        });
      })
      .catch((err) => {
        success = false;
        enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
          variant: "error",
        });
      });
    return success ? { ...newRow, isNew: true } : { ...oldRow, isNew: false };
  };
  return (
    <Box sx={{ height: 640, width: "100%" }}>
      <DataGrid
        // autoHeight
        rows={message}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        onSelectionModelChange={(id) => setSelectedId(id as unknown as number)}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
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
export default BookDataTable;
