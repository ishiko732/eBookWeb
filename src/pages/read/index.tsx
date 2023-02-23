import { role } from "../../api/entity/auth";
import React, { useEffect } from "react";
import RequiredRole from "../../config/requiredRole";
import { Box, Stack, CssBaseline } from "@mui/material";
import { useSnackbar } from "notistack";
import FileTreeView from "../../components/file-tree/FileTreeView";
import { getChildByParentId, getTopFolder } from "../../api/file";
import { folder } from "../../api/models";
import { TreeData, TreeType } from "../../components/tree-view/CustomTreeView";
import { filesToTreeData, toTreeData } from "../../algorithm/tree";
import { useUserContext } from "../../UserContext";
import AccordionItems, { AccordionItem } from "../../components/AccordionItems";
import { documentInitParameters, generateURL } from "../viewer/PDFBrowse";
import { Document, Pages } from "../../components/pdfViewer2";
import { UploadImage } from "../../components/pdfViewer2/basicFunctions/UploadImage";
import { CurrentPage } from "../../components/pdfViewer2/navigationComponents";
import { useReadContext } from "./ReadContext";
import { goPage } from "../../components/pdfViewer2/navigationComponents/CurrentPage";
import { task } from "../../utils/sleep";

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
  const [items, setItems] = React.useState<AccordionItem[]>([]);
  const { selectedFilesNode, setSelectFilesNode } = useReadContext();
  const [resouceId, setResouceId] = React.useState<string>("");
  const [scale, setScale] = React.useState(1.33);

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
                handleMessage(obj);
              });
            }
          } else {
            setMessage(data);
            handleMessage(data);
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

  const handleMessage = (treedata: TreeData[]) => {
    const _items: AccordionItem[] = [];
    const newFiles: AccordionItem = {
      title: "Files",
      details: (
        <FileTreeView data={treedata} operation={operation} loginUser={user} />
      ),
      defaultExpanded: true,
    };
    _items.push(newFiles);
    _items.push(newFiles);
    setItems(_items);
  };
  useEffect(() => {
    if (!selectedFilesNode) {
      return;
    }
    const file = selectedFilesNode.at(-1);
    if (file && file.type === "PDF" && file.resoureId) {
      if (resouceId !== "") {
        goPage(1);
        setResouceId("");
        task();
      }
      setResouceId(file.resoureId);
    }
    setSelectFilesNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilesNode]);

  const [itemWidth, setItemWidth] = React.useState<number | undefined | string>(
    "18rem"
  );

  useEffect(() => {
    const _scrollBar = document.getElementsByClassName(
      "PrivateSwipeArea-root css-x15wq9"
    );
    if (_scrollBar.length > 0) {
      (_scrollBar[0] as HTMLDivElement).style.position = "absolute";
    }
    const _viewer = document.getElementById("viewer");
    if (_viewer && _viewer.offsetLeft) {
      setItemWidth(_viewer.offsetLeft - 96);
    }
  }, []);
  return (
    <RequiredRole
      user={user}
      requireRole={[role.SUPERADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <React.Fragment>
        <CssBaseline />
        <Box
          sx={{
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <AccordionItems
            items={items}
            style={{
              position: "fixed",
              maxWidth: itemWidth,
              minWidth: itemWidth,
              transform: "width 200ms",
            }}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {resouceId !== "" && (
            <Box maxWidth={document.body.clientWidth * 0.7}>
              <Document
                option={documentInitParameters(generateURL(resouceId))}
                scale={scale}
              >
                <Pages />
                <CurrentPage />
                <UploadImage />
              </Document>
            </Box>
          )}
        </Stack>
      </React.Fragment>
    </RequiredRole>
  );
};

export default ReadControl;
