import { ThemeProvider } from "@emotion/react";
import { InsertDriveFile } from "@mui/icons-material";
import { TreeView } from "@mui/lab";
import { getMuiTheme } from "./Styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { renderTreeData } from "./CustomTreeViewHelper";
import { useEffect, useState } from "react";
import { toTree } from "../../algorithm/tree";
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

const CustomTreeView = ({
  data,
  setData,
  operation,
  loads,
  setLoads,
  expands,
  handleNodeSelect,
  isSearch,
}: {
  data: TreeData[];
  setData: React.Dispatch<React.SetStateAction<TreeData[]>>;
  loads: string[];
  setLoads: React.Dispatch<React.SetStateAction<string[]>>;
  expands: string[];
  operation: any;
  handleNodeSelect: (
    event: React.SyntheticEvent,
    ids: string[] | string
  ) => void;
  isSearch: boolean;
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const DatatoTree = (parentId: string, childNode: TreeData[]) => {
    setData((dates) => {
      return toTree(dates, parentId, childNode);
    });
  };
  const handleToggle = async (event: React.SyntheticEvent, nodes: string[]) => {
    event.preventDefault();
    setExpanded(nodes);
    const [nodeId] = nodes.filter((x) => !loads.includes(x));
    if (nodeId) {
      const { status, data } = await operation(nodeId);
      if (status) {
        DatatoTree(nodeId, data);
      }
      setLoads((Ids) => {
        // console.log([...Ids, nodeId]);
        return [nodeId, ...Ids];
      });
    }
  };
  useEffect(() => {
    setExpanded(expands);
  }, [expands]);

  return (
    // <Box mt={2} ml={2} bgcolor="white" width="300px">
    <ThemeProvider theme={getMuiTheme()}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultEndIcon={<InsertDriveFile />}
        expanded={expanded}
        onNodeToggle={handleToggle}
        onNodeSelect={handleNodeSelect}
      >
        {renderTreeData(data, loads, isSearch)}
      </TreeView>
    </ThemeProvider>
    // </Box>
  );
};

export default CustomTreeView;

export type TreeType = "File" | "Folder" | "PDF" | "Topic" | "Note";
export type TreeData = {
  id: string;
  name: string;
  disabledButton: boolean;
  children?: TreeData[];
  type: TreeType;
};
