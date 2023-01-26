import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Badge,
  IconButton,
  Button,
  ButtonGroup,
  Popover,
} from "@mui/material";
import React from "react";
import { delete_token } from "../config/token";
import { logout } from "../api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

function Buttons() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Button key="one">配置</Button>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          logout()
            .then((res) => {
              delete_token();
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            })
            .catch((err) => {
              delete_token();
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            });
        }}
      >
        {t("logout")}
      </Button>
    </React.Fragment>
  );
}

export default function UserAvatar({ userStatus }: { userStatus: boolean }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box component="center">
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
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="contained"
          color="primary"
        >
          <Buttons />
        </ButtonGroup>
      </Popover>
    </Box>
  );
}
