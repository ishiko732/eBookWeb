import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/register";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/dashboard/Home/Home";
import MyHome from "../pages/home";
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
import SystemControl from "../pages/system/SystemControl";
import OnlineControl from "../pages/system/OnlineControl";
import UserControl from "../pages/management/UserControl";
import MediaControl from "../pages/management/MediaControl";
import BookControl from "../pages/management/BookControl";
import ShareControl from "../pages/management/ShareControl";
import Forbidden from "../pages/exception/403";

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
      path: "/",
      element: <Dashboard {...props} />,
      redirect: "MyHome",
      //开头不能添加/,不然得从根目录写起'/dashboard/home'
      children: [
        {
          path: "system",
          element: <SystemControl {...props} />,
        },
        {
          path: "online",
          element: <OnlineControl {...props} />,
        },
        {
          path: "control",
          element: <Stile />,
          children: [
            {
              path: "/users",
              element: <UserControl {...props} />,
            },
            {
              path: "/medium",
              element: <MediaControl {...props} />,
            },
            {
              path: "/books",
              element: <BookControl {...props} />,
            },
            {
              path: "/share",
              element: <ShareControl {...props} />,
            },
          ],
        },
        {
          path: "home",
          element: <Home {...props} />,
        },
        {
          path: "MyHome",
          element: <MyHome {...props} />,
        },
        {
          path: "browse",
          element: <MyHome {...props} />,
        },
        {
          path: "read",
          element: <MyHome {...props} />,
        },
        {
          path: "note",
          element: <MyHome {...props} />,
        },
      ],
    },
    {
      path: "/exception/403",
      element: <Forbidden />,
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
          link: "system",
        },
        {
          icon: <OnlinePredictionIcon color="primary" />,
          label: "menu.System-onlineConfig",
          link: "online",
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
          link: "control/users",
        },
        {
          icon: <TheatersIcon color="primary" />,
          label: "menu.Admin-mediaConfig",
          link: "control/medium",
        },
        {
          icon: <MenuBookIcon color="primary" />,
          label: "menu.Admin-bookConfig",
          link: "control/books",
        },
        {
          icon: <ShareIcon color="primary" />,
          label: "menu.Admin-shareConfig",
          link: "control/share",
        },
      ],
    });
  }
  items.push({
    icon: <WebIcon sx={{ color: "#3f51b5" }} />,
    label: "menu.Browse",
    link: "MyHome",
    children: [
      {
        icon: <PublicIcon sx={{ color: "#3f51b5" }} />,
        label: "menu.Browse-public",
        link: "browse",
      },
      {
        icon: <LibraryBooksIcon sx={{ color: "#3f51b5" }} />,
        label: "menu.Browse-Read",
        link: "read",
      },
      {
        icon: <EventNoteIcon sx={{ color: "#3f51b5" }} />,
        label: "menu.Browse-Notes",
        link: "note",
      },
    ],
  });
  return items;
};

export const defaultLanguage = "zh_CN";
export const defaultRole = role.TEMP;
export const default403URL = "/exception/403";
