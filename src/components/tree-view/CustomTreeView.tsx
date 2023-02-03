import { ThemeProvider } from "@emotion/react";
import { InsertDriveFile } from "@mui/icons-material";
import { TreeView } from "@mui/lab";
import { Box } from "@mui/material";
import { getMuiTheme } from "./Styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { renderTreeData } from "./CustomTreeViewHelper";
import { useState } from "react";
import { findItem } from "../../algorithm/findItem";

const classes = {
  focused: {
    bgcolor: "transparent",
    py: "1px",
    px: "7px",
    border: `1px solid ${getMuiTheme().palette.secondary.main}`,
  },
  selected: {
    bgcolor: getMuiTheme().palette.primary.main,
    color: "white",
  },
};

const toTree = (
  dates: TreeData[],
  parentId: string,
  childNode: TreeData[]
): any => {
  const parent: TreeData | null = findItem(dates, parentId, "id", "children");
  if (parent) {
    if (parent.children) {
      // eslint-disable-next-line array-callback-return
      childNode.map((node) => {
        parent.children?.unshift(node);
      });
    } else {
      parent.children = childNode;
    }
  }
  return dates;
};

const CustomTreeView = ({
  data,
  setData,
  operation,
  loads,
  handleNodeSelect,
}: {
  data: TreeData[];
  setData: React.Dispatch<React.SetStateAction<TreeData[]>>;
  loads: string[];
  operation: any;
  handleNodeSelect: (
    event: React.SyntheticEvent,
    ids: string[] | string
  ) => void;
}) => {
  const [expanded, setExpanded] = useState<string[]>(loads);
  const DatatoTree = (parentId: string, childNode: TreeData[]) => {
    setData((dates) => {
      return toTree(dates, parentId, childNode);
    });
  };
  const handleToggle = async (event: React.SyntheticEvent, nodes: string[]) => {
    event.preventDefault();
    const [nodeId] = nodes.filter((x) => !expanded.includes(x));
    if (nodeId) {
      const { status, data } = await operation(nodeId);
      if (status) {
        DatatoTree(nodeId, data);
        setExpanded((Ids) => {
          console.log([...Ids, nodeId]);
          return [...Ids, nodeId];
        });
      }
    }
  };

  return (
    <Box mt={2} ml={2} bgcolor="white" width="300px">
      <ThemeProvider theme={getMuiTheme()}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<InsertDriveFile />}
          onNodeToggle={handleToggle}
          onNodeSelect={handleNodeSelect}
          // sx={{
          //   ".MuiTreeItem-root": {
          //     ".Mui-focused:not(.Mui-selected)": classes.focused,
          //     ".Mui-selected, .Mui-focused.Mui-selected, .Mui-selected:hover":
          //       classes.selected
          //   }
          // }}
        >
          {renderTreeData(data, expanded)}
        </TreeView>
      </ThemeProvider>
    </Box>
  );
};

export default CustomTreeView;

export type TreeData = {
  id: string;
  name: string;
  disabledButton: boolean;
  children?: TreeData[];
  type: "file" | "folder" | "PDF" | "Topic" | "Note";
};
