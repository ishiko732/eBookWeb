import { role } from "../../api/entity/auth";
import React, { useEffect } from "react";
import RequiredRole from "../../config/requiredRole";
import { Box, Stack, CssBaseline } from "@mui/material";
import { useSnackbar } from "notistack";
import FileTreeView from "../../components/file-tree/FileTreeView";
import { getChildByParentId, getFile, getTopFolder } from "../../api/file";
import { file, folder } from "../../api/models";
import { TreeData, TreeType } from "../../components/tree-view/CustomTreeView";
import { filesToTreeData, toTreeData } from "../../algorithm/tree";
import { useUserContext } from "../../UserContext";
import AccordionItems, { AccordionItem } from "../../components/AccordionItems";
import { documentInitParameters, generateURL } from "../viewer/PDFBrowse";
import { Document, Pages } from "../../components/pdfViewer2";
import { UploadImage } from "../../components/pdfViewer2/basicFunctions/UploadImage";
import {
  CurrentPage,
  Outline,
} from "../../components/pdfViewer2/navigationComponents";
import { goPage } from "../../components/pdfViewer2/navigationComponents/CurrentPage";
import { task } from "../../utils/sleep";
import { viewer_outline } from "../../components/pdfViewer2/basicFunctions/LoadOutline";
import { OutlineItems } from "../../components/pdfViewer2/navigationComponents/OutlineItems";
import {
  LeftBar,
  RightBar,
} from "../../components/pdfViewer2/navigationComponents/PositionBar";
import { selectionchange } from "../../components/pdfViewer2/basicFunctions/SelectionText";
import ExcerptNotes from "./excerptNotes";

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
  const [resouceId, setResouceId] = React.useState<string>("");
  const [file, setFile] = React.useState<file | null>();
  const [scale, setScale] = React.useState(1.33);
  const textRef = React.useRef<HTMLInputElement | null>(null);

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
        <FileTreeView
          data={treedata}
          operation={operation}
          loginUser={user}
          handleSelectNode={handleSelectNode}
        />
      ),
      defaultExpanded: true,
    };
    _items.push(newFiles);
    setItems(_items);
  };

  const handleOutline = (outline: viewer_outline[]) => {
    const outlineAccordionItems: AccordionItem = {
      title: "Outline",
      details: <OutlineItems outline={outline} />,
      defaultExpanded: false,
    };
    setItems((pre) => {
      let newdata = [...pre];
      if (pre.length !== 1) {
        newdata = newdata.splice(0, 1);
      }
      // newdata[0].defaultExpanded = false; 无法修改默认状态
      outline.length > 0 && newdata.push(outlineAccordionItems);
      return newdata;
    });
  };
  const handleSelectNode = (selectedFilesNode: TreeData[]) => {
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
      getFile(Number(file.id.split("_").at(-1))).then((res) =>
        setFile(res.data)
      );
      setResouceId(file.resoureId);
    }
  };

  const handleText = (event: Event) => {
    const text = selectionchange(event);
    if (text && textRef.current) {
      textRef.current.value = text;
    }
  };
  useEffect(() => {
    const _scrollBar = document.getElementsByClassName(
      "PrivateSwipeArea-root css-x15wq9"
    );
    if (_scrollBar.length > 0) {
      (_scrollBar[0] as HTMLDivElement).style.position = "absolute";
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
        <LeftBar alway_children={true}>
          <AccordionItems items={items} />
        </LeftBar>
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
                <Outline handleOutline={handleOutline} />
                <Pages handleText={handleText} />
                <CurrentPage />
                <UploadImage />
              </Document>
            </Box>
          )}
        </Stack>
        <RightBar
          style={{
            top: 33,
          }}
        >
          <ExcerptNotes file={file} textRef={textRef} />
        </RightBar>
      </React.Fragment>
    </RequiredRole>
  );
};

export default ReadControl;
