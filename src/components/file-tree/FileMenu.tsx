import { Menu, MenuItem } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { TreeData } from "../tree-view/CustomTreeView";

export const FileMenu = ({
  open,
  handleClose,
  position,
  selectedNode,
}: {
  open: boolean;
  handleClose: (type: FileMenuType, event?: any) => void;
  position: { top: number; left: number } | undefined;
  selectedNode: TreeData[] | null;
}) => {
  const [node, setNode] = React.useState<TreeData[] | null>(null);
  React.useEffect(() => {
    setNode(selectedNode);
  }, [selectedNode]);

  return (
    <Menu
      open={open}
      onClose={() => handleClose}
      anchorReference="anchorPosition"
      anchorPosition={open ? position : undefined}
    >
      <MenuItem
        onClick={(event) => {
          handleClose("Copy", event);
        }}
      >
        {t("TreeView.Copy", { name: node?.at(-1)?.name })}
      </MenuItem>
      <MenuItem
        onClick={(event) => {
          handleClose("Upload", event);
        }}
      >
        {t("TreeView.Upload", { type: t(`TreeView.File`) })}
      </MenuItem>
      {["File", "PDF"].indexOf(node?.at(-1)?.type || "File") !== -1 ? null : (
        <MenuItem
          onClick={(event) => {
            handleClose("Add", event);
          }}
        >
          {t("TreeView.Add", {
            type: t(`TreeView.${node?.at(-1)?.type}`),
          })}
        </MenuItem>
      )}
      <MenuItem
        onClick={(event) => {
          handleClose("Rename", event);
        }}
      >
        {t("TreeView.Rename", {
          type: t(`TreeView.${node?.at(-1)?.type}`),
        })}
      </MenuItem>
      {/* <MenuItem
        onClick={(event) => {
          handleClose("Move", event);
        }}
      >
        {t("TreeView.Move", {
          type: t(`TreeView.${node?.at(-1)?.type}`),
        })}
      </MenuItem> */}
      <MenuItem
        onClick={(event) => {
          handleClose("Delete", event);
        }}
      >
        {t("TreeView.Delete", {
          type: t(`TreeView.${node?.at(-1)?.type}`),
        })}
      </MenuItem>
    </Menu>
  );
};

export type FileMenuType =
  | "Copy"
  | "Add"
  | "Delete"
  | "Move"
  | "Rename"
  | "Upload"
  | null;