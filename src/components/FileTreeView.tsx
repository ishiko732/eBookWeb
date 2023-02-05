import { Menu, MenuItem, Stack, ThemeProvider } from "@mui/material";
import CustomTreeView, { TreeData } from "./tree-view/CustomTreeView";
import { useState, MouseEvent, useEffect, MouseEventHandler } from "react";
import { getMuiTheme } from "./tree-view/Styles";
import Search from "./search-bar/search";
import copy from "../utils/clip";
import { DFS_path, search } from "../algorithm/graph";
import { useTranslation } from "react-i18next";
import InputDialog, { DialogMessage } from "./InputDialog";
import { treeUnique } from "../algorithm/tree";

export default function FileTreeView({
  data,
  operation,
  ram,
}: {
  data: TreeData[];
  operation: any;
  ram?: string;
}) {
  const { t } = useTranslation();
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
    // const path=DFS_path(message, ids as string, "id", "children")
    // console.log(path)
    setSelectNode(DFS_path(message, ids as string, "id", "children"));
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    (event.target as HTMLInputElement).click();
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
    type: FileMenu,
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

  const handleDialogClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    dialogMessage?: DialogMessage,
    text?: string
  ) => {
    if (reason !== "backdropClick") {
      console.log(dialogMessage);
      console.log(selectedNode);
      console.log(text);
      setOpenDialog((pre) => {
        return { ...pre, open: false };
      });
    }
  };

  return (
    <Stack spacing={2}>
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
          <Menu
            open={contextMenu !== null}
            onClose={() => handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem
              onClick={(event) => {
                handleClose("Copy", event);
              }}
            >
              {t("TreeView.Copy", { name: selectedNode?.at(-1)?.name })}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handleClose("Upload", event);
              }}
            >
              {t("TreeView.Upload", { type: t(`TreeView.File`) })}
            </MenuItem>
            {selectedNode?.at(-1)?.type === "File" ? null : (
              <MenuItem
                onClick={(event) => {
                  handleClose("Add", event);
                }}
              >
                {t("TreeView.Add", {
                  type: t(`TreeView.${selectedNode?.at(-1)?.type}`),
                })}
              </MenuItem>
            )}
            <MenuItem
              onClick={(event) => {
                handleClose("Rename", event);
              }}
            >
              {t("TreeView.Rename", {
                type: t(`TreeView.${selectedNode?.at(-1)?.type}`),
              })}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handleClose("Move", event);
              }}
            >
              {t("TreeView.Move", {
                type: t(`TreeView.${selectedNode?.at(-1)?.type}`),
              })}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handleClose("Delete", event);
              }}
            >
              {t("TreeView.Delete", {
                type: t(`TreeView.${selectedNode?.at(-1)?.type}`),
              })}
            </MenuItem>
          </Menu>
        </ThemeProvider>
      </div>
      <InputDialog dialogMessage={openDialog} handleClose={handleDialogClose} />
    </Stack>
  );
}

export type FileMenu =
  | "Copy"
  | "Add"
  | "Delete"
  | "Move"
  | "Rename"
  | "Upload"
  | null;
