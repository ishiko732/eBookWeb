import {
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  ThemeProvider,
} from "@mui/material";
import CustomTreeView, { TreeData } from "../tree-view/CustomTreeView";
import { useState, MouseEvent, useEffect, MouseEventHandler } from "react";
import { getMuiTheme } from "../tree-view/Styles";
import Search from "../search-bar/search";
import copy from "../../utils/clip";
import { DFS_Delete, DFS_path, search } from "../../algorithm/graph";
import { useTranslation } from "react-i18next";
import InputDialog, { DialogMessage } from "./InputDialog";
import { toTree, toTreeData, treeUnique } from "../../algorithm/tree";
import { FileMenu, FileMenuType } from "./FileMenu";
import { addFolder, deleteFolder } from "../../api/file";
import { useSnackbar } from "notistack";
import { folder } from "../../api/models";

export default function FileTreeView({
  data,
  operation,
  loginUser,
  ram,
}: {
  data: TreeData[];
  operation: any;
  loginUser: any;
  ram?: string;
}) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [message, setMessage] = useState<TreeData[]>([]);
  const [selectedNode, setSelectNode] = useState<TreeData[] | null>(null);
  const [filter, setFilter] = useState<TreeData[] | null>(null);
  const [loads, setLoads] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<DialogMessage>({
    open: false,
    title: "",
    context: "",
    type: null,
    yes: "",
    no: "",
  });
  useEffect(() => {
    if (searchQuery.length > 0) {
      const { filter, loaded } = search(
        message,
        searchQuery,
        "name",
        "children"
      );
      setFilter(filter);
      setExpanded(loaded);
    } else {
      setFilter(null);
      setExpanded([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    setMessage(treeUnique(data));
  }, [data]);

  useEffect(() => {
    if (message.length > 0) {
      ram && localStorage.setItem(ram, JSON.stringify(message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const handleNodeSelect = (
    event: React.SyntheticEvent,
    ids: string[] | string
  ) => {
    // setSelectText(event.currentTarget.textContent);
    const path = DFS_path(message, ids as string, "id", "children");
    console.log(path);
    // setMessage((dates) => {
    //   console.log(DFS_Delete(dates, "id", "children", path));
    //   return dates;
    // });

    setSelectNode(path);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.target instanceof HTMLElement &&(event.target as HTMLElement).click()
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };
  const handleClose = (
    type: FileMenuType,
    event?: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    event?.preventDefault();
    // console.log((event?.target as HTMLInputElement).innerText);
    const title = (event?.target as HTMLInputElement).innerText;
    const fileType = selectedNode?.at(-1)?.type;
    const context = t("TreeView.Input", { type: t(`TreeView.${fileType}`) });
    const DialogMessage: DialogMessage = {
      open: true,
      title: title,
      context: context,
      type: type,
      yes: t("TreeView.YES", { opt: t(`TreeView.opt.${type}`) }),
      no: t("TreeView.NO"),
    };
    console.log(type);
    switch (type) {
      case "Copy":
        copy(selectedNode?.at(-1)?.name || "");
        break;
      case "Add":
        setOpenDialog(DialogMessage);
        break;
      case "Delete":
      case "Move":
        setOpenDialog(DialogMessage);
        break;
      case "Rename":
        setOpenDialog({
          ...DialogMessage,
          preValue: selectedNode?.at(-1)?.name,
        });
        break;
      case "Upload":
        setOpenDialog(DialogMessage);
        break;
      default:
        break;
    }
  };
  window.addEventListener("click", () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  });

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
        const currentNode = selectedNode.at(-1) as TreeData;
        setLoading(true);
        switch (dialogMessage.type) {
          case "Add":
            if (text) {
              if (currentNode.type === "Folder") {
                await addFolder({
                  uid: loginUser.id,
                  name: text as string,
                  parentId: Number(currentNode.id.split("_").at(-1)),
                })
                  .then((res) => {
                    const data: folder = res.data;
                    // 从folder转换为TreeData[] 再利用toTree合并到tree
                    setMessage((dates) => {
                      return toTree(
                        dates,
                        `Folder_${data.parentId}`,
                        toTreeData([data])
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
              }
            }
            break;
          case "Delete":
            if (currentNode.type === "Folder") {
              if (currentNode.type === "Folder") {
                await deleteFolder(Number(currentNode.id.split("_").at(-1)))
                  .then((res) => {
                    setMessage((dates) => {
                      DFS_Delete(dates, "id", "children", selectedNode);
                      return dates;
                    });
                    enqueueSnackbar(t("api.opt_success"), {
                      variant: "success",
                    });
                  })
                  .catch((err) => {
                    //TODO 硬编码
                    if (err.msg === "未找到目录") {
                      setMessage((dates) => {
                        DFS_Delete(dates, "id", "children", selectedNode);
                        return dates;
                      });
                      enqueueSnackbar(t("api.opt_success"), {
                        variant: "success",
                      });
                    } else {
                      enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
                        variant: "error",
                      });
                    }
                  });
              }
            }
            break;
          // case "Move":
          //   setOpenDialog(DialogMessage);
          //   break;
          // case "Rename":
          //   setOpenDialog({
          //     ...DialogMessage,
          //     preValue: selectedNode?.at(-1)?.name,
          //   });
          //   break;
          // case "Upload":
          //   setOpenDialog(DialogMessage);
          //   break;
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
    <Stack spacing={2}>
      {isLoading ? <LinearProgress color="info" /> : null}
      <Search value={searchQuery} setValue={setSearchQuery} />
      <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
        <ThemeProvider theme={getMuiTheme()}>
          <CustomTreeView
            data={filter || message}
            setData={setMessage}
            operation={operation}
            loads={loads}
            setLoads={setLoads}
            expands={expanded}
            handleNodeSelect={handleNodeSelect}
            isSearch={searchQuery.length > 0}
          />
          <FileMenu
            open={contextMenu !== null}
            position={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
            handleClose={handleClose}
            selectedNode={selectedNode}
          />
        </ThemeProvider>
      </div>
      <InputDialog dialogMessage={openDialog} handleClose={handleDialogClose} />
    </Stack>
  );
}
