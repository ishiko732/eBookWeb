import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Stack,
  Typography,
} from "@mui/material";
import { AxiosProgressEvent } from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { filesToTreeData, toTree, toTreeData } from "../../algorithm/tree";
import { uploadFile } from "../../api/file";
import { file as fileModel } from "../../api/models";
import { TreeData } from "../tree-view/CustomTreeView";
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Stack
      direction="row"
      spacing={0}
      justifyContent="center"
      alignItems="center"
    >
      <LinearProgress
        variant="determinate"
        {...props}
        sx={{ width: "100%", mr: 1 }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 35 }}
      >{`${Math.round(props.value)}%`}</Typography>
    </Stack>
  );
}

const UploadFile = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [progress, setProgress] = React.useState(0);
  const [file, setFile] = useState<File | null>();

  const uploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      setProgress(((progressEvent.loaded / progressEvent.total) * 100) | 0);
    }
  };
  const setData = (data: fileModel) => {
    props.setData &&
      props.setData((dates: TreeData[]) => {
        const newData = toTree(
          dates,
          `Folder_${props.fid}`,
          filesToTreeData([data])
        );
        return newData;
      });
  };
  useEffect(() => {
    setFile(props.files);
  }, [props.files]);
  useEffect(() => {
    if (file) {
      uploadFile(file, props.fid, uploadProgress)
        .then((res) => {
          console.log(res.data);
          setData(res.data.mediaFile);
          enqueueSnackbar(t("api.opt_success"), {
            variant: "success",
          });
          setFile(null);
          setProgress(0);
        })
        .catch((err) => {
          enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
            variant: "error",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return (
    <React.Fragment>
      {file && progress !== 0 ? (
        <LinearProgressWithLabel value={progress} />
      ) : null}
    </React.Fragment>
  );
};

export default UploadFile;
