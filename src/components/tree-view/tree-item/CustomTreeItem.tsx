import { TreeItemProps, TreeItem } from "@mui/lab";
import CustomContent from "./CustomContent";

const CustomTreeItem = (props: TreeItemProps) => (
  <TreeItem
    ContentComponent={CustomContent}
    {...props}
    sx={{
      width: "fit-content",
      ".MuiTreeItem-content": {
        py: "2px",
        width: "fit-content",
      },
    }}
  />
);

export default CustomTreeItem;
