import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

type Anchor = "top" | "left" | "bottom" | "right";

export default function PositionSwipeableDrawer({
  position,
  open,
  setOpen,
  setAnchorEl,
}: {
  position: Anchor;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnchorEl?: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}) {
  React.useEffect(() => {
    if (open && setAnchorEl !== undefined) {
      setAnchorEl(null);
    }
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

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  console.log(position + " " + open);
  return (
    <div>
      <React.Fragment>
        {/* <Button onClick={toggleDrawer(true)}>{position}</Button> */}
        <SwipeableDrawer
          anchor={position}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          {list(position)}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}