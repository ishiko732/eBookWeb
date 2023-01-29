import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/register";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/dashboard/Home/Home";
import Stile from "../components/OutletStile";
import Hello from "../pages/dashboard/Hello";
import NotFound from "../pages/exception/404";
import { get_refresh_token } from "./token";
import { Navigate } from "react-router-dom";

//Icon
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import TerminalIcon from "@mui/icons-material/Terminal";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TheatersIcon from "@mui/icons-material/Theaters";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShareIcon from "@mui/icons-material/Share";
import WebIcon from "@mui/icons-material/Web";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PublicIcon from "@mui/icons-material/Public";
import { role } from "../api/entity/auth";

export interface route {
  path: string;
  element: JSX.Element;
  redirect?: string;
  children?: route[];
}
export const routes = (props: any): route[] => {
  return [
    {
      path: "/login",
      element: <Login {...props} />,
    },
    {
      path: "/register",
      element: <SignUp />,
    },
    {
      path: "/dashboard",
      element: <Dashboard {...props} />,
      redirect: "home", //开头不能添加/,不然得从根目录写起'/dashboard/home'
      children: [
        {
          path: "/home",
          element: <Home {...props} />,
        },
        {
          path: "/test",
          element: <Stile />,
          redirect: ".",
          children: [
            {
              path: "/",
              element: <Hello text="TEST" />,
            },
            {
              path: "/hello",
              element: <Hello text="Hello" />,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element:
        get_refresh_token() === "" ? (
          <Navigate to="/login" />
        ) : (
          <Navigate to="/dashboard" />
        ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];
};
export interface ListBarData {
  icon: JSX.Element;
  label: string;
  link: string;
  children?: ListBarData[];
}

export const menus = (r: role): ListBarData[] => {
  let items: ListBarData[] = [];
  if (r === role.SUPERADMIN) {
    items.push({
      icon: <SettingsSuggestIcon color="primary" />,
      label: "menu.System",
      link: "#",
      children: [
        {
          icon: <TerminalIcon color="primary" />,
          label: "menu.System-systemConfig",
          link: "home",
        },
        {
          icon: <OnlinePredictionIcon color="primary" />,
          label: "menu.System-onlineConfig",
          link: "test",
        },
      ],
    });
  }
  if (r === role.SUPERADMIN || r === role.ADMIN) {
    items.push({
      icon: <AppSettingsAltIcon color="primary" />,
      label: "menu.Admin",
      link: "#",
      children: [
        {
          icon: <ManageAccountsIcon color="primary" />,
          label: "menu.Admin-userConfig",
          link: "home",
        },
        {
          icon: <TheatersIcon color="primary" />,
          label: "menu.Admin-mediaConfig",
          link: "test",
        },
        {
          icon: <MenuBookIcon color="primary" />,
          label: "menu.Admin-bookConfig",
          link: "test",
        },
        {
          icon: <ShareIcon color="primary" />,
          label: "menu.Admin-shareConfig",
          link: "test",
        },
      ],
    });
  }
  items.push({
    icon: <WebIcon sx={{ color: "#3f51b5" }} />,
    label: "menu.Browse",
    link: "#",
    children: [
      {
        icon: <PublicIcon sx={{ color: "#3f51b5" }} />,
        label: "menu.Browse-public",
        link: "home",
      },
      {
        icon: <LibraryBooksIcon sx={{ color: "#3f51b5" }} />,
        label: "menu.Browse-Read",
        link: "#",
      },
      {
        icon: <EventNoteIcon sx={{ color: "#3f51b5" }} />,
        label: "menu.Browse-Notes",
        link: "home",
      },
    ],
  });
  return items;
};

export const defaultLanguage = "zh_CN";
