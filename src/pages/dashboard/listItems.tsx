import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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

const data: ListBarData[] = [
  {
    icon: <DashboardIcon />,
    label: "Dashboard",
    link: "#",
    children: [
      { icon: <Dns />, label: "Database", link: "home" },
      { icon: <Public />, label: "Hosting", link: "test" },
    ],
  },
  {
    icon: <ShoppingCartIcon />,
    label: "Customers",
    link: "#",
    children: [
      { icon: <Dns />, label: "Database", link: "home" },
      { icon: <Public />, label: "Hosting", link: "test" },
    ],
  },
  { icon: <People />, label: "Authentication", link: "/dashboard/test/hello" },
  { icon: <Dns />, label: "Database", link: "#" },
  { icon: <PermMedia />, label: "Storage", link: "home" },
  { icon: <Public />, label: "Hosting", link: "home" },
];

export default function NestedList({
  data,
  userStatus,
}: {
  data: ListBarData[];
  userStatus?: boolean;
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
        selected: index.toString(),
        open: list,
      })
    );
  }

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
    >
      {data.map((item: ListBarData, index: number) => {
        return item.children ? (
          <React.Fragment>
            <ListItemButton
              component={Rlink}
              to={item.link}
              selected={index.toString() === selected}
              onClick={() => {
                handleListItemClick(index.toString());
                handleClick(index);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {open[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {item.children.map((item_c: ListBarData, index_c: number) => {
              return (
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      component={Rlink}
                      to={item_c.link}
                      selected={index + "-" + index_c === selected}
                      onClick={() => {
                        handleListItemClick(index + "-" + index_c);
                      }}
                    >
                      <ListItemIcon>{item_c.icon}</ListItemIcon>
                      <ListItemText primary={item_c.label} />
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
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      })}
      <Divider sx={{ my: 1, alignItems: "center" }} />
      <UserAvatar userStatus={userStatus || false}>
        <UserMenu />
      </UserAvatar>
    </List>
  );
}
export function ListBar(props: any) {
  return (
    <React.Fragment>
      <NestedList data={data} userStatus={props.health} />
    </React.Fragment>
  );
}
