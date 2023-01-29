import * as React from "react";
import { get_access_token } from "../../config/token";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ListBar } from "./listItems";

import Copyright from "../../components/Copyright";
import { Loading } from "../../components/Loading";

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
const mdTheme = createTheme();

function DashboardContent(props: any) {
  const { submittingStatus, user, health, onHealth, isloading, isCompleted } =
    props;
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    submittingStatus.current = true;
    onHealth.current = true;
  }, []);

  if (user === null) {
    return <Loading />;
  }
  if (isCompleted.current === true) {
    if (user === null) {
      <Navigate replace to={"/login"} />;
    }
    isCompleted.current = false;
  }
  const toggleDrawer = () => {
    setOpen(!open);
    console.log(user);
  };
  return (
    <ThemeProvider theme={mdTheme}>
      {isloading ? <Loading /> : null}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
              // ...(open?{justifyContent:"flex-end"}:{justifyContent:"center"}),
            }}
          >
            <IconButton onClick={toggleDrawer}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
          <Divider />
          <ListBar {...props} />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard(props: any) {
  if (get_access_token().length === 0) {
    return <Navigate replace to="/login" />;
  }
  return <DashboardContent {...props} />;
}
