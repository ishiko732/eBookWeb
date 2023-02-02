import * as React from "react";
import { get_access_token, get_refresh_token } from "../../config/token";
import { Navigate, Outlet } from "react-router-dom";
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
import { defaultLanguage } from "../../config/config";
import { useTranslation } from "react-i18next";

export const languages_width: any = {
  zh_CN: 240,
  ja_JP: 250,
  en_US: 320,
};
interface DrawerProps {
  open: boolean;
  width: number;
}
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open, width }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: width,
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
  const {
    submittingStatus,
    user,
    setUser,
    isloading,
    onHealth,
    // setHealth,
    mainOpen,
    setMainOpen,
  } = props;
  const { i18n } = useTranslation();
  React.useEffect(() => {
    onHealth.current = true;
    if (user == null) {
      submittingStatus.current = true;
      setUser(get_access_token());
    } else if (user === get_access_token()) {
      setUser(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    // onHealth.current = true;
    if (user !== null && user !== get_access_token()) {
      onHealth.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const toggleDrawer = () => {
    setMainOpen((open: boolean) => {
      return !open;
    });
    // setOpen(!open);
  };
  return (
    <ThemeProvider theme={mdTheme}>
      {isloading ? <Loading /> : null}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          open={mainOpen}
          width={languages_width[i18n.language || defaultLanguage]}
        >
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
              {mainOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
          <Divider />
          <ListBar {...props} open={mainOpen} />
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
          <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Outlet />
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard(props: any) {
  if (get_refresh_token().length === 0) {
    return <Navigate replace to="/login" />;
  }
  return <DashboardContent {...props} />;
}
