import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Divider, List, Collapse } from "@mui/material";
import { Link as Rlink } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import UserAvatar from "../../components/UserAvatar";
import UserMenu from "./UserMenu";
import People from "@mui/icons-material/People";
import PermMedia from "@mui/icons-material/PermMedia";
import Dns from "@mui/icons-material/Dns";
import Public from "@mui/icons-material/Public";
import { ListBarData } from "../../Type";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import TerminalIcon from "@mui/icons-material/Terminal";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TheatersIcon from "@mui/icons-material/Theaters";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShareIcon from "@mui/icons-material/Share";
import { useTranslation } from "react-i18next";
import WebIcon from "@mui/icons-material/Web";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PublicIcon from "@mui/icons-material/Public";
const data: ListBarData[] = [
  {
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
  },
  {
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
  },
  {
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
  },
];

export default function NestedList({
  data,
  userStatus,
  props,
  main_open,
}: {
  data: ListBarData[];
  main_open: boolean;
  userStatus?: boolean;
  props?: any;
}) {
  const [open, setOpen] = React.useState<boolean[]>(
    new Array(data.length).fill(false)
  );
  const [selected, setSelected] = React.useState<string | null>(null);
  const submittingStatus = React.useRef(true);
  React.useEffect(() => {
    if (submittingStatus.current) {
      submittingStatus.current = false;
      const list_data = localStorage.getItem("list_data");
      if (list_data) {
        setOpen(JSON.parse(list_data).open);
        setSelected(JSON.parse(list_data).selected);
      }
    }
  }, []);

  const handleListItemClick = (index: string) => {
    setSelected(index);
    localStorage.setItem(
      "list_data",
      JSON.stringify({
        mainOpen: main_open as boolean,
        selected: index,
        open: open,
      })
    );
  };
  function handleClick(index: number) {
    let list = [...open];
    list[index] = !list[index];
    setOpen(list);
    localStorage.setItem(
      "list_data",
      JSON.stringify({
        mainOpen: main_open as boolean,
        selected: index.toString(),
        open: list,
      })
    );
  }
  const { t } = useTranslation();
  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      key="main.list"
    >
      {data.map((item: ListBarData, index: number) => {
        return item.children ? (
          <React.Fragment>
            <ListItemButton
              key={`main.${item.label}`}
              component={Rlink}
              to={item.link}
              selected={index.toString() === selected}
              onClick={() => {
                handleListItemClick(index.toString());
                handleClick(index);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.label)} />
              {open[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {item.children.map((item_c: ListBarData, index_c: number) => {
              return (
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    key={`children.${item.label}`}
                  >
                    <ListItemButton
                      key={`children.${item.label}.${item_c.label}`}
                      sx={{ pl: 4 }}
                      component={Rlink}
                      to={item_c.link}
                      selected={index + "-" + index_c === selected}
                      onClick={() => {
                        handleListItemClick(index + "-" + index_c);
                      }}
                    >
                      <ListItemIcon>{item_c.icon}</ListItemIcon>
                      <ListItemText primary={t(item_c.label)} />
                    </ListItemButton>
                  </List>
                </Collapse>
              );
            })}
          </React.Fragment>
        ) : (
          <ListItemButton
            component={Rlink}
            to={item.link}
            selected={index.toString() === selected}
            onClick={() => {
              handleListItemClick(index.toString());
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.label)} />
          </ListItemButton>
        );
      })}
      <Divider sx={{ my: 1, alignItems: "center" }} />
      <UserAvatar userStatus={userStatus || false}>
        <UserMenu {...props} />
      </UserAvatar>
    </List>
  );
}
export function ListBar(props: any) {
  return (
    <React.Fragment>
      <NestedList
        data={data}
        userStatus={props.health}
        main_open={props.open}
      />
    </React.Fragment>
  );
}
