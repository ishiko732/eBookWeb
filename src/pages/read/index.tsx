import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { loginUser } from "../../api/auth";
import {
  Box,
  Chip,
  Paper,
  Typography,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  CssBaseline,
  makeStyles,
  Card,
  CardContent,
} from "@mui/material";
import Title from "../../components/Title";
import request from "../../config/request";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useSnackbar } from "notistack";
import FileTreeView from "../../components/file-tree/FileTreeView";
import { getChildByParentId, getTopFolder } from "../../api/file";
import { folder, User } from "../../api/models";
import { TreeData, TreeType } from "../../components/tree-view/CustomTreeView";
import { filesToTreeData, toTreeData, treeUnique } from "../../algorithm/tree";
import { useUserContext } from "../../UserContext";

async function operation(type_id: string) {
  let ret: { status: boolean; data: any } = { status: false, data: null };
  const [type, id] = type_id.split("_");
  if ((type as TreeType) === "Folder") {
    await getChildByParentId(id)
      .then((res) => {
        ret = { status: true, data: toTreeData(res.data as folder[]) };
      })
      .catch((err) => {
        ret = { status: false, data: err };
      });
  }
  return ret;
}

const ReadControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<TreeData[]>([]);
  const { user, t } = useUserContext();

  React.useEffect(() => {
    if (status) {
      const json = localStorage.getItem("read_tree");
      getTopFolder(user.id)
        .then((res) => {
          // console.log(res.data);
          const data: TreeData[] = toTreeData(res.data);
          if (json) {
            const obj: TreeData[] = JSON.parse(json);
            if (obj.length === data.length) {
              (res.data as folder[]).forEach((folder, index) => {
                if (folder.files) {
                  const filesData = filesToTreeData(folder.files);
                  if (obj[index].children) {
                    obj[index].children?.push(...filesData);
                  } else {
                    obj[index].children = filesData;
                  }
                }
                setMessage(obj);
              });
            }
          } else {
            setMessage(data);
          }
          enqueueSnackbar(t("api.success"), { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar(t("api.error"), { variant: "error" });
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <RequiredRole
      user={user}
      requireRole={[role.SUPERADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <React.Fragment>
        <CssBaseline />
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Box bgcolor="white" width="300px">
            <Paper elevation={3}>
              <FileTreeView
                data={message}
                operation={operation}
                // ram="read_tree"
                loginUser={user}
              />
            </Paper>
          </Box>
        </Stack>
      </React.Fragment>
    </RequiredRole>
  );
};

export default ReadControl;
