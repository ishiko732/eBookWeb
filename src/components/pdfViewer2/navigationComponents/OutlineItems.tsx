import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { viewer_outline } from "../basicFunctions/LoadOutline";
import { goPage } from "./CurrentPage";

const renderTree = (nodes: viewer_outline) => {
  const handleClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: viewer_outline
  ) => {
    if ((event.target as HTMLElement).className === "MuiTreeItem-label") {
      nodes.page
        ? goPage(nodes.page)
        : window
            .open(nodes.url || "#", nodes.url ? "_blank" : undefined)
            ?.focus();
    }
  };

  return (
    <TreeItem
      key={`Outline-${nodes.title}`}
      nodeId={nodes.title}
      label={nodes.title}
      onClick={(event) => {
        handleClick(event, nodes);
      }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
};
export const OutlineItems = ({ outline }: { outline: viewer_outline[] }) => {
  return (
    <TreeView
      aria-label="outline items"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ maxHeight: 340, flexGrow: 1, overflowY: "auto" }}
    >
      {outline.map((item) => {
        return renderTree(item);
      })}
    </TreeView>
  );
};
