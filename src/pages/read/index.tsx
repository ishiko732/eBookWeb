import { role } from "../../api/entity/auth";
import React, { useEffect } from "react";
import RequiredRole from "../../config/requiredRole";
import { Box, Stack, CssBaseline } from "@mui/material";
import { useSnackbar } from "notistack";
import { getTopFolder } from "../../api/file";
import { file, folder } from "../../api/models";
import { TreeData } from "../../components/tree-view/CustomTreeView";
import { filesToTreeData, toTreeData } from "../../algorithm/tree";
import { useUserContext } from "../../UserContext";
import { documentInitParameters, generateURL } from "../viewer/PDFBrowse";
import { Document, Pages } from "../../components/pdfViewer2";
import { UploadImage } from "../../components/pdfViewer2/basicFunctions/UploadImage";
import {
  CurrentPage,
  Outline,
} from "../../components/pdfViewer2/navigationComponents";
import { viewer_outline } from "../../components/pdfViewer2/basicFunctions/LoadOutline";
import {
  LeftBar,
  RightBar,
} from "../../components/pdfViewer2/navigationComponents/PositionBar";
import { selectionchange } from "../../components/pdfViewer2/basicFunctions/SelectionText";
import ExcerptNotes from "./excerptNotes";
import { DEFAULT_SCALE } from "../../config/config";
import ExcerptTree from "./excerptTree";

const ReadControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<TreeData[]>([]);
  const { user, t } = useUserContext();
  const [resouceId, setResouceId] = React.useState<string>("");
  const [file, setFile] = React.useState<file | null>();
  const [outline, setOutline] = React.useState<viewer_outline[]>([]);
  const [scale, setScale] = React.useState(DEFAULT_SCALE);
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

  const handleOutline = (outline: viewer_outline[]) => {
    setOutline(outline);
  };

  const handleText = (event: Event) => {
    const text = selectionchange(event);
    if (text && textRef.current) {
      textRef.current.value = text;
    }
  };
  useEffect(() => {
    return () => {
      const _scrollBar = document.getElementsByClassName(
        "PrivateSwipeArea-root css-x15wq9"
      );
      if (_scrollBar.length > 0) {
        (_scrollBar[0] as HTMLDivElement).style.position = "absolute";
      }
    };
  });

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
          <ExcerptTree
            treeData={message}
            setTreeData={setMessage}
            file={file}
            setFile={setFile}
            outline={outline}
            resouceId={resouceId}
            setResouceId={setResouceId}
            textRef={textRef}
          />
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
          <ExcerptNotes file={file}/>
        </RightBar>
      </React.Fragment>
    </RequiredRole>
  );
};

export default ReadControl;
