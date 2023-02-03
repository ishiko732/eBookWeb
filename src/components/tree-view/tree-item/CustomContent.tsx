import { TreeItemContentProps, useTreeItem } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";

const CustomContent = React.forwardRef((props: TreeItemContentProps, ref) => {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleSelection(event);
  };

  return (
    <Box display="flex">
      <Box
        className={classes.iconContainer}
        onClick={handleExpansionClick}
        sx={{
          minWidth: "16px",
          cursor: "pointer",
          opacity: disabled ? 0.38 : 1,
          py: "2px",
        }}
      >
        {expansionIcon}
      </Box>
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={clsx(className, classes.root, {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        })}
        onMouseDown={handleMouseDown}
        onClick={handleSelectionClick}
      >
        {iconProp && <div className={classes.iconContainer}>{iconProp}</div>}
        <Typography component="div" className={classes.label}>
          {label}
        </Typography>
      </div>
    </Box>
  );
});

export default CustomContent;
