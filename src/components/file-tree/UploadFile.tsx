import {
  LinearProgress,
  LinearProgressProps,
  Stack,
  Typography,
} from "@mui/material";
import { AxiosProgressEvent } from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { filesToTreeData, toTree } from "../../algorithm/tree";
import { uploadFile } from "../../api/file";
import { file, file as fileModel } from "../../api/models";
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
  const setTableData = (data: file) => {
    props.setTableData &&
      props.setTableData((dates: file[]) => {
        const newData = [...dates];
        newData.push(data);
        return newData;
      });
  };
  useEffect(() => {
    if (props.file && props.fid) {
      props.setLoading && props.setLoading(true);
      uploadFile(props.file, props.fid, uploadProgress)
        .then((res) => {
          console.log(res.data);
          setData(res.data.mediaFile);
          setTableData(res.data.mediaFile);
          enqueueSnackbar(t("api.opt_success"), {
            variant: "success",
          });
          props.setFile(null);
          setProgress(0);
          props.setLoading && props.setLoading(false);
        })
        .catch((err) => {
          props.setFile(null);
          props.setLoading && props.setLoading(false);
          enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
            variant: "error",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.file]);
  return (
    <React.Fragment>
      {props.files && progress !== 0 ? (
        <LinearProgressWithLabel value={progress} />
      ) : null}
    </React.Fragment>
  );
};

export default UploadFile;
