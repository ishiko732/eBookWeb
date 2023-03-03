import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import PermDataSettingOutlinedIcon from "@mui/icons-material/PermDataSettingOutlined";
import AnimationSharpIcon from "@mui/icons-material/AnimationSharp";
import AddIcon from "@mui/icons-material/Add";
import { useSwipeableDrawerContext } from "../../components/PositionSwipeableDrawer";
import FSRSConfig from "./FSRSConfig";
const actions = [
  {
    icon: <PermDataSettingOutlinedIcon />,
    name: "FSRSConfig",
    JSX: <FSRSConfig />,
  },
  {
    icon: <AddIcon />,
    name: "add Card",
  },
];
const ReviewConfig = () => {
  const [openDial, setOpenDial] = React.useState(false);
  const handleOpen = () => setOpenDial(true);
  const handleClose = () => setOpenDial(false);
  const { open, setOpen, setDrawerContent, setWidth, setPostion } =
    useSwipeableDrawerContext();

  return (
    <SpeedDial
      ariaLabel="review config speed dial"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<AnimationSharpIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={openDial}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            handleClose();
            if (action.JSX) {
              setDrawerContent(action.JSX);
              setPostion("right");
              // setWidth("500px")
              setOpen(true);
            }
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default ReviewConfig;
