import { Box } from "@mui/material";
import React from "react";
export const RightBar = (props: {
  children?: JSX.Element | null;
  style?: React.CSSProperties;
  alway_children?: boolean;
}) => {
  const [viewer, setViewer] = React.useState<HTMLElement | null>();
  const [itemWidth, setItemWidth] = React.useState<number | undefined | string>(
    "18rem"
  );
  const [editorLeft, setEditLeft] = React.useState<number | undefined | string>(
    "18rem"
  );
  const getSize = () => {
    const _viewer = document.getElementById("viewer");
    _viewer && setItemWidth(_viewer.offsetLeft - 96);
    _viewer && setEditLeft(_viewer.offsetLeft + _viewer.offsetWidth + 16);
    setViewer(_viewer);
  };

  React.useEffect(() => {
    return () => {
      getSize();
    };
  });

  React.useEffect(() => {
    window.addEventListener("resize", getSize);
    return () => {
      window.removeEventListener("resize", getSize);
    };
  }, []);

  return (
    <React.Fragment>
      {viewer || props.alway_children ? (
        <Box
          sx={{
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            position: "fixed",
            left: editorLeft,
            maxWidth: itemWidth,
            minWidth: itemWidth,
            transform: "width 200ms",
            ...props.style,
          }}
        >
          {props.children}
        </Box>
      ) : null}
    </React.Fragment>
  );
};

export const LeftBar = (props: {
  children?: JSX.Element | null;
  style?: React.CSSProperties;
  alway_children?: boolean;
}) => {
  const [viewer, setViewer] = React.useState<HTMLElement | null>();
  const [itemWidth, setItemWidth] = React.useState<number | undefined | string>(
    "18rem"
  );
  const getSize = () => {
    const _viewer = document.getElementById("viewer");
    _viewer && setItemWidth(_viewer.offsetLeft - 96);
    setViewer(_viewer);
  };
  React.useEffect(() => {
    return () => {
      getSize();
    };
  });

  React.useEffect(() => {
    window.addEventListener("resize", getSize);
    return () => {
      window.removeEventListener("resize", getSize);
    };
  }, []);

  return (
    <React.Fragment>
      {viewer || props.alway_children ? (
        <Box
          sx={{
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            position: "fixed",
            maxWidth: itemWidth,
            minWidth: itemWidth,
            transform: "width 200ms",
            ...props.style,
          }}
        >
          {props.children}
        </Box>
      ) : null}
    </React.Fragment>
  );
};
