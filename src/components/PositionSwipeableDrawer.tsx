import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
type Anchor = "top" | "left" | "bottom" | "right";

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
