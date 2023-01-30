import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Badge,
  IconButton,
  ButtonGroup,
  Popover,
  Menu,
} from "@mui/material";
import React from "react";
import UserMenu from "../pages/dashboard/UserMenu";
import PositionSwipeableDrawer from "./PositionSwipeableDrawer";
import ConfigBar from "../pages/dashboard/ConfigBar";

const StyledBadge = styled(Badge)(({ theme }: any) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function UserAvatar({
  user,
  userStatus,
  children,
}: {
  userStatus: boolean;
  children?: JSX.Element;
  user?: any;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openConfig, setOpenConfig] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box
      component="center"
      sx={{ position: "fixed", bottom: "16px", left: "4px" }}
    >
      <IconButton id={id} onClick={handleClick}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: userStatus ? "#44b700" : "#ff0000",
              color: userStatus ? "#44b700" : "#ff0000",
            },
          }}
        >
          <Avatar alt="User" sx={{ width: 48, height: 48 }} />
        </StyledBadge>
      </IconButton>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <UserMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setOpenConfig={setOpenConfig}
        />
        {children}
      </Menu>
      <PositionSwipeableDrawer
        position="right"
        open={openConfig}
        setOpen={setOpenConfig}
        setAnchorEl={setAnchorEl}
        width={300}
      >
        <ConfigBar user={user} />
      </PositionSwipeableDrawer>
    </Box>
  );
}
