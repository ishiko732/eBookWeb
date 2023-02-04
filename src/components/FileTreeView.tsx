import { Menu, MenuItem, Stack, ThemeProvider } from "@mui/material";
import CustomTreeView, { TreeData } from "./tree-view/CustomTreeView";
import { useState, MouseEvent, useEffect } from "react";
import { getMuiTheme } from "./tree-view/Styles";
import { search } from "../algorithm/findItem";
import Search from "./search-bar/search";
import { folder } from "../api/models";

export const toTreeData = (folders: folder[]): TreeData[] => {
  const tree: TreeData[] = [];
  Array.isArray(folders) &&
    // eslint-disable-next-line array-callback-return
    folders.map((folder) => {
      tree.push({
        id: `Folder_${folder.id}`,
        name: folder.name,
        disabledButton: false,
        type: "Folder",
        children: folder.files.map((file) => {
          const filenameLower = file.filename.toLowerCase();
          const isPdf = filenameLower.endsWith(".pdf");
          const isTopic = filenameLower.endsWith(".topic");
          const fileType = isPdf ? "PDF" : isTopic ? "Topic" : "File";
          return {
            id: `${fileType}_${file.id}`,
            name:
              fileType === "File"
                ? file.filename
                : file.filename.substring(0, file.filename.lastIndexOf(".")),
            disabledButton: false,
            type: fileType,
          };
        }),
      });
    });
  return tree;
};

export default function FileTreeView({
  data,
  operation,
  ram,
}: {
  data: TreeData[];
  operation: any;
  ram?: string;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<
    string[] | string | null
  >(null);
  const [selectedText, setSelectText] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    (event.target as HTMLInputElement).click();
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  const handleClose = () => {
    setContextMenu(null);
  };

  const [message, setMessage] = useState<TreeData[]>([]);
  const [filter, setFilter] = useState<TreeData[] | null>(null);
  const [loads, setLoads] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleNodeSelect = (
    event: React.SyntheticEvent,
    ids: string[] | string
  ) => {
    setSelectedNodeId(ids);
    setSelectText(event.currentTarget.textContent);
    console.log(ids + ":" + event.currentTarget.textContent);
  };
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
    setMessage(data);
  }, [data]);

  useEffect(() => {
    if (message.length > 0) {
      ram && localStorage.setItem(ram, JSON.stringify(message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

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
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleClose}>Copy Ctrl+C</MenuItem>
            <MenuItem onClick={handleClose}>Delete {selectedText}</MenuItem>
            <MenuItem onClick={handleClose}>Move</MenuItem>
            <MenuItem onClick={handleClose}>Email</MenuItem>
          </Menu>
        </ThemeProvider>
      </div>
    </Stack>
  );
}
