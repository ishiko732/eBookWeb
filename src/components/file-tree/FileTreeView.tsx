import { Divider, LinearProgress, Stack, ThemeProvider } from "@mui/material";
import CustomTreeView, { TreeData } from "../tree-view/CustomTreeView";
import { useState, MouseEvent, useEffect } from "react";
import { getMuiTheme } from "../tree-view/Styles";
import Search from "../search-bar/search";
import copy from "../../utils/clip";
import {
  DFS_Delete,
  DFS_path,
  DFS_Rename,
  search,
} from "../../algorithm/graph";
import { useTranslation } from "react-i18next";
import InputDialog, { DialogMessage } from "./InputDialog";
import {
  topicsToTreeData,
  toTree,
  toTreeData,
  treeUnique,
} from "../../algorithm/tree";
import { FileMenu, FileMenuType } from "./FileMenu";
import {
  addFolder,
  deleteFile,
  deleteFolder,
  updateFile,
  updateFolder,
} from "../../api/file";
import { useSnackbar } from "notistack";
import { folder, topic, User } from "../../api/models";
import UploadFile from "./UploadFile";
import React from "react";
import {
  createTopic,
  deleteTopic,
  queryTopics,
  updateTopic,
} from "../../api/note";

export default function FileTreeView({
  data,
  operation,
  loginUser,
  ram,
  handleSelectNode,
}: {
  data: TreeData[];
  operation: any;
  loginUser: User;
  ram?: string;
  handleSelectNode?: (nodes: TreeData[]) => void;
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
  const [file, setFile] = useState<File | null>();
  const [parentId, setParentId] = useState<number | null>(null);
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
    setSelectNode(path);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.target instanceof HTMLElement &&
      (event.target as HTMLElement).click();
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
    event?:
      | MouseEvent<HTMLLIElement, globalThis.MouseEvent>
      | React.ChangeEvent<HTMLInputElement>
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
        const file: File | null | undefined = (
          event?.target as HTMLInputElement
        ).files?.item(0);
        const nodesForPath: TreeData[] = (selectedNode as TreeData[]) || [];
        for (let index = nodesForPath?.length - 1; index >= 0; index--) {
          if (nodesForPath[index].type === "Folder") {
            setParentId(Number(nodesForPath[index].id.split("_").at(-1)));
            break;
          }
        }
        setFile(file);
        (event?.target as HTMLInputElement).value = "";
        break;
      case "Share":
        setOpenDialog({
          ...DialogMessage,
          // node: selectedNode?.at(-1),
        });
        break;
      case "Open":
        setSearchQuery(selectedNode?.at(-1)?.name || "");
        const fileId = Number(selectedNode?.at(-1)?.id.split("_").at(-1));
        (async (fileId: number) => {
          const topics = await queryTopics({ fileId: fileId });
          const isEmpty =
            Array.isArray(topics.data) && topics.data.length === 0;
          console.log(isEmpty);
          isEmpty &&
            createTopic({
              fileId: fileId,
              name: "default",
            })
              .then((res) => {
                setMessage((pre) => {
                  const newdata = [...pre];
                  const tree = toTree(
                    newdata,
                    `PDF_${fileId}`,
                    topicsToTreeData(new Array(res.data as topic))
                  );
                  return tree;
                });
                setFilter((pre) => {
                  if (!pre) {
                    return pre;
                  }
                  const newdata = [...pre];
                  const tree = toTree(
                    newdata,
                    `PDF_${fileId}`,
                    topicsToTreeData(new Array(res.data as topic))
                  );
                  return tree;
                });
              })
              .catch((err) => {
                console.log(err);
              });
        })(fileId);
        handleSelectNode && handleSelectNode(selectedNode!);
        break;
      default:
        break;
    }
  };
  window.addEventListener("click", (event) => {
    // event.preventDefault(); // 移除拦截input file
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
      if (dialogMessage && selectedNode) {
        if (event.type === "keyup" && dialogMessage.type === "Share") {
          return event.preventDefault();
        }
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
                      const newData = toTree(
                        dates,
                        `Folder_${data.parentId}`,
                        toTreeData([data])
                      );
                      ram && localStorage.setItem(ram, JSON.stringify(newData));
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
                  });
              } else if (currentNode.type === "PDF") {
                await createTopic({
                  fileId: Number(currentNode.id.split("_").at(-1)),
                  name: text as string,
                })
                  .then((res) => {
                    const data: topic = res.data;
                    setMessage((dates) => {
                      const newData = toTree(
                        dates,
                        currentNode.id,
                        topicsToTreeData([data])
                      );
                      ram && localStorage.setItem(ram, JSON.stringify(newData));
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
                  });
              } else if (currentNode.type === "Topic") {
                const parentNode = selectedNode.at(-2);
                parentNode &&
                  (await createTopic({
                    topicId: currentNode.id.split("_").at(-1),
                    name: text as string,
                  })
                    .then((res) => {
                      const data: topic = res.data;
                      setMessage((dates) => {
                        const newData = toTree(
                          dates,
                          parentNode.id,
                          topicsToTreeData([data])
                        );
                        ram &&
                          localStorage.setItem(ram, JSON.stringify(newData));
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
              }
            }
            break;
          case "Delete":
            if (currentNode.type === "Folder") {
              await deleteFolder(Number(currentNode.id.split("_").at(-1)))
                .then((res) => {
                  setMessage((dates) => {
                    DFS_Delete(dates, "id", "children", selectedNode);
                    ram && localStorage.setItem(ram, JSON.stringify(dates));
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
                      ram && localStorage.setItem(ram, JSON.stringify(dates));
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
            } else if (["File", "PDF"].indexOf(currentNode.type) !== -1) {
              await deleteFile(Number(currentNode.id.split("_").at(-1)))
                .then((res) => {
                  setMessage((dates) => {
                    DFS_Delete(dates, "id", "children", selectedNode);
                    ram && localStorage.setItem(ram, JSON.stringify(dates));
                    return dates;
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
            } else if (currentNode.type === "Topic") {
              await deleteTopic(String(currentNode.id.split("_").at(-1)))
                .then((res) => {
                  setMessage((dates) => {
                    DFS_Delete(dates, "id", "children", selectedNode);
                    ram && localStorage.setItem(ram, JSON.stringify(dates));
                    return dates;
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
            break;
          // case "Move":
          //   setOpenDialog(DialogMessage);
          //   break;
          case "Rename":
            console.log(text, currentNode);
            if (text && currentNode.type === "Folder") {
              await updateFolder(Number(currentNode.id.split("_").at(-1)), text)
                .then((res) => {
                  setMessage((dates) => {
                    DFS_Rename(
                      dates,
                      "id",
                      "name",
                      "children",
                      text,
                      selectedNode
                    );
                    ram && localStorage.setItem(ram, JSON.stringify(dates));
                    console.log(dates);
                    return dates;
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
            } else if (
              text &&
              ["File", "PDF"].indexOf(currentNode.type) !== -1
            ) {
              await updateFile(
                Number(currentNode.id.split("_").at(-1)),
                currentNode.type === "PDF" ? text + ".pdf" : text
              )
                .then((res) => {
                  setMessage((dates) => {
                    DFS_Rename(
                      dates,
                      "id",
                      "name",
                      "children",
                      text,
                      selectedNode
                    );
                    ram && localStorage.setItem(ram, JSON.stringify(dates));
                    console.log(dates);
                    return dates;
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
            } else if (text && currentNode.type === "Topic") {
              //@ts-ignore
              await updateTopic({
                id: String(currentNode.id.split("_").at(-1)),
                uid: loginUser.id,
                name: text,
              })
                .then((res) => {
                  setMessage((dates) => {
                    DFS_Rename(
                      dates,
                      "id",
                      "name",
                      "children",
                      text,
                      selectedNode
                    );
                    ram && localStorage.setItem(ram, JSON.stringify(dates));
                    console.log(dates);
                    return dates;
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
    <Stack>
      {isLoading ? <LinearProgress color="info" /> : null}
      <UploadFile
        file={file}
        setFile={setFile}
        setData={setMessage}
        fid={parentId}
      />
      <Search value={searchQuery} setValue={setSearchQuery} />
      <Divider />
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
      <InputDialog
        dialogMessage={openDialog}
        handleClose={handleDialogClose}
        selectedNode={selectedNode}
      />
    </Stack>
  );
}
