import {
  PictureAsPdfOutlined,
  ImageOutlined,
  FolderZip,
  InsertDriveFile,
  FolderOutlined,
} from "@mui/icons-material";
import React from "react";
import CustomTreeItem from "./tree-item/CustomTreeItem";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TopicIcon from "@mui/icons-material/Topic";
import { TreeData, TreeType } from "./CustomTreeView";
const getFileIcon = (filename: string) => {
  if (filename.toLowerCase().endsWith(".pdf")) {
    return <PictureAsPdfOutlined />;
  } else if (
    [".png", ".jpg"].some((ext) => filename.toLowerCase().endsWith(ext))
  ) {
    return <ImageOutlined />;
  } else if (filename.toLowerCase().endsWith(".zip")) {
    return <FolderZip />;
  } else {
    return <InsertDriveFile />;
  }
};

const getFolderIcon = (type: TreeType) => {
  if (type === "Folder") {
    return <FolderOutlined />;
  } else if (type === "PDF") {
    return <PictureAsPdfOutlined />;
  } else if (type === "Topic") {
    return <TopicIcon />;
  } else {
    return <FolderOutlined />;
  }
};

export const renderTreeData = (
  data: TreeData[],
  expanded: string[],
  isSearch: boolean
) => {
  return data.map((item) => (
    <React.Fragment key={item.id}>
      {["Folder", "PDF", "Topic"].indexOf(item.type) !== -1 ? (
        <CustomTreeItem
          nodeId={item.id}
          label={item.name}
          disabled={item.disabledButton}
          icon={getFolderIcon(item.type)}
        >
          {!isSearch && expanded.indexOf(item.id) === -1 ? (
            <CustomTreeItem
              nodeId={`loading.${item.id}`}
              label={"loading"}
              disabled={true}
              icon={<AutorenewIcon />}
            />
          ) : null}

          {item.children?.length ? (
            renderTreeData(item.children, expanded, isSearch)
          ) : (
            <div key="stub" />
          )}
        </CustomTreeItem>
      ) : (
        <CustomTreeItem
          nodeId={item.id}
          label={item.name}
          disabled={item.disabledButton}
          icon={getFileIcon(item.name)}
        ></CustomTreeItem>
      )}
    </React.Fragment>
  ));
};
