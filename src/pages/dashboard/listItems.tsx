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
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import { ListBarData, menus } from "../../config/config";
import { role } from "../../api/entity/auth";
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
  const [tipOpen, setTipOpen] = React.useState<string>("");

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
            <Tooltip
              enterDelay={700}
              title={t(item.label)}
              placement="right"
              open={tipOpen === index.toString()}
              onClose={() => {
                setTipOpen("");
              }}
              onOpen={() => {
                if (!main_open) {
                  return setTipOpen(index.toString());
                }
              }}
            >
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
            </Tooltip>
            {item.children.map((item_c: ListBarData, index_c: number) => {
              return (
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    key={`children.${item.label}`}
                  >
                    <Tooltip
                      enterDelay={700}
                      title={t(item_c.label)}
                      placement="right"
                      open={tipOpen === index + "-" + index_c}
                      onClose={() => {
                        setTipOpen("");
                      }}
                      onOpen={() => {
                        if (!main_open) {
                          return setTipOpen(index + "-" + index_c);
                        }
                      }}
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
                    </Tooltip>
                  </List>
                </Collapse>
              );
            })}
          </React.Fragment>
        ) : (
          <Tooltip
            enterDelay={700}
            title={t(item.label)}
            placement="right"
            open={tipOpen === index.toString()}
            onClose={() => {
              setTipOpen("");
            }}
            onOpen={() => {
              if (!main_open) {
                return setTipOpen(index.toString());
              }
            }}
          >
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
          </Tooltip>
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
        data={menus(props.user?.role || role.USER)}
        userStatus={props.health}
        main_open={props.open}
      />
    </React.Fragment>
  );
}
