import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { createContext } from "react";
export type Anchor = "top" | "left" | "bottom" | "right";

export default function PositionSwipeableDrawer({
  position,
  open,
  setOpen,
  setAnchorEl,
  children,
  width = 250,
}: {
  position: Anchor;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnchorEl?: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  children?: JSX.Element;
  width?: number | string;
}) {
  React.useEffect(() => {
    if (open && setAnchorEl !== undefined) {
      setAnchorEl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const toggleDrawer =
    (_open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(_open);
    };
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <div>
      <React.Fragment>
        <SwipeableDrawer
          anchor={position}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          <Box
            sx={{
              width:
                position === "top" || position === "bottom" ? "auto" : width,
            }}
            // role="presentation"
            // onClick={toggleDrawer(false)}
            // onKeyDown={toggleDrawer(false)}
          >
            {children}
          </Box>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}

interface ProviderContext {
  position: Anchor;
  setPostion: React.Dispatch<React.SetStateAction<Anchor>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  drawerContent: JSX.Element | undefined;
  setDrawerContent: React.Dispatch<
    React.SetStateAction<JSX.Element | undefined>
  >;
}
// @ts-ignore
export const SwipeableDrawerContext = createContext<ProviderContext>();

export function useSwipeableDrawerContext() {
  return React.useContext(SwipeableDrawerContext);
}

export const SwipeableDrawerProvider = (props: { children: JSX.Element }) => {
  const [position, setPostion] = React.useState<Anchor>("right");
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [width, setWidth] = React.useState(250);
  const [drawerContent, setDrawerContent] = React.useState<JSX.Element>();
  const value = {
    position,
    setPostion,
    open,
    setOpen,
    anchorEl,
    setAnchorEl,
    width,
    setWidth,
    drawerContent,
    setDrawerContent,
  };

  return (
    <SwipeableDrawerContext.Provider value={value}>
      {props.children}
      <PositionSwipeableDrawer
        position={position}
        open={open}
        setOpen={setOpen}
        setAnchorEl={setAnchorEl}
        width={width}
      >
        {drawerContent}
      </PositionSwipeableDrawer>
    </SwipeableDrawerContext.Provider>
  );
};
