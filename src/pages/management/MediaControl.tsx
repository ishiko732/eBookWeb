import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { userByName } from "../../api/user";
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
  TextField,
  Button,
} from "@mui/material";
import Title from "../../components/Title";
import { useSnackbar } from "notistack";
import { file } from "../../api/models";
import { AccountCircle } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  deleteFile,
  downloadFile,
  getFolderIdByUidAndFolderName,
  mediesByUid,
  updateFile,
} from "../../api/file";
import MediaDataTable from "./MediaDataTable";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UploadFile from "../../components/file-tree/UploadFile";
import InputDialog, {
  DialogMessage,
} from "../../components/file-tree/InputDialog";
import { filesToTreeData } from "../../algorithm/tree";
const MediaControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<file[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [searchName, setSearchName] = React.useState<string>("");
  const [searchUid, setSearchUid] = React.useState<number | null>(null);
  const [file, setFile] = React.useState<File | null>();
  const [parentId, setParentId] = React.useState<number | null>(null);
  const [selectedNode, setSelectNode] = React.useState<file | null>(null);
  const [openDialog, setOpenDialog] = React.useState<DialogMessage>({
    open: false,
    title: "",
    context: "",
    type: null,
    yes: "",
    no: "",
  });

  const handleSearch = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
      | null,
    searchName: string
  ) => {
    if (searchName.length === 0) {
      return;
    }
    setLoading(true);
    userByName(searchName)
      .then((res) => {
        setSearchUid(res.data.id);
        getFolderIdByUidAndFolderName(res.data.id, "buffer").then((res) => {
          const list: number[] = res.data;
          setParentId(list[0]);
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err?.msg, { variant: "error" });
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (searchUid) {
      setLoading(true);
      mediesByUid(searchUid)
        .then((res) => {
          setMessage(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          enqueueSnackbar(err?.msg, { variant: "error" });
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchUid]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = (
      event?.target as HTMLInputElement
    ).files?.item(0);
    searchUid && parentId && setFile(file);
  };

  const ClickOp = (
    event: SelectChangeEvent,
    row: file,
    info: "Download" | "Update" | "Delete"
  ) => {
    setSelectNode(row);
    const fileType = filesToTreeData([row])[0].type;
    const DialogMessage: DialogMessage = {
      open: true,
      title: (event?.target as HTMLInputElement).innerText,
      context: t("TreeView.Input", { type: t(`TreeView.${fileType}`) }),
      type: info,
      yes: t("TreeView.YES", { opt: t(`TreeView.opt.${info}`) }),
      no: t("TreeView.NO"),
    };
    if (info === "Download") {
      setLoading(true);
      downloadFile(row.fsId).then((res) => {
        setLoading(false);
      });
    } else if (info === "Update") {
      setOpenDialog({
        ...DialogMessage,
        preValue: row.filename,
      });
    } else if (info === "Delete") {
      setOpenDialog(DialogMessage);
    }
  };

  const handleDialogClose = async (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    dialogMessage?: DialogMessage,
    text?: string
  ) => {
    if (reason !== "backdropClick") {
      console.log(dialogMessage);
      console.log(selectedNode);
      console.log(text);
      if (dialogMessage && selectedNode) {
        setLoading(true);
        switch (dialogMessage.type) {
          case "Delete":
            await deleteFile(selectedNode.id)
              .then((res) => {
                setMessage((dates) => {
                  return dates.filter(
                    (data: file) => data.id !== selectedNode.id
                  );
                });
                enqueueSnackbar(t("api.opt_success"), {
                  variant: "success",
                });
              })
              .catch((err) => {
                enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
                  variant: "error",
                });
              });
            break;
          // case "Move":
          //   setOpenDialog(DialogMessage);
          //   break;
          case "Update":
          case "Rename":
            text &&
              (await updateFile(selectedNode.id, text)
                .then((res) => {
                  setMessage((dates) => {
                    const index = dates.indexOf(selectedNode);
                    const newData = [...dates];
                    newData[index].filename = text;
                    return newData;
                  });
                  enqueueSnackbar(t("api.opt_success"), {
                    variant: "success",
                  });
                })
                .catch((err) => {
                  enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
                    variant: "error",
                  });
                }));
            break;
          default:
            break;
        }
        setLoading(false);
      }
      setOpenDialog((pre) => {
        return { ...pre, open: false };
      });
    }
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
          <Title>{t("management.media.title")}</Title>
          <UploadFile
            file={file}
            setFile={setFile}
            fid={parentId}
            setTableData={setMessage}
            setLoading={setLoading}
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <AccountCircle sx={{ mr: 1, my: 0.5 }} color="info" />
              <TextField
                id="input-search-username"
                label={t("management.media.username")}
                variant="standard"
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
                error={searchName === ""}
                onKeyUp={(event) => {
                  if (event.key === "Enter" && searchName !== "") {
                    handleSearch(event, searchName);
                  }
                }}
              />
              <Button
                variant="contained"
                endIcon={<SearchIcon />}
                onClick={(event) => {
                  handleSearch(event, searchName);
                }}
              >
                {t("management.media.search")}
              </Button>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Typography color="text.secondary">
              {t("management.media.number")}
            </Typography>
            <Chip label={message.length} color={"info"} />
            <Divider orientation="vertical" flexItem />
            <Tooltip title={t("management.media.upload")}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="application/pdf,image/*"
                  type="file"
                  onChange={(event) => {
                    handleUpload(event);
                  }}
                />
                <UploadFileIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider light flexItem sx={{ margin: "8px" }} />
          <MediaDataTable
            ClickOp={ClickOp}
            message={message}
            isLoading={isLoading}
            setMessage={setMessage}
          />
        </Paper>
        <InputDialog
          dialogMessage={openDialog}
          handleClose={handleDialogClose}
        />
      </Box>
    </RequiredRole>
  );
};

export default MediaControl;
