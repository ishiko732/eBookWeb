import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import PermDataSettingOutlinedIcon from "@mui/icons-material/PermDataSettingOutlined";
import AnimationSharpIcon from "@mui/icons-material/AnimationSharp";
// import AddIcon from "@mui/icons-material/Add";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useSwipeableDrawerContext } from "../../../components/PositionSwipeableDrawer";
import FSRSConfig from "./FSRSConfig";
import useExportCards from "./ExportCards";
import { useUserContext } from "../../../UserContext";
const ReviewConfig = () => {
  const [openDial, setOpenDial] = React.useState(false);
  const handleOpen = () => setOpenDial(true);
  const handleClose = () => setOpenDial(false);
  const { user } = useUserContext();
  const { setOpen, setDrawerContent, setPostion } = useSwipeableDrawerContext();
  const actions = [
    {
      icon: <PermDataSettingOutlinedIcon />,
      name: "FSRSConfig",
      JSX: <FSRSConfig />,
    },
    {
      icon: <GetAppIcon />,
      name: "Export",
      use: useExportCards,
    },
  ];
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
              setOpen(true);
            } else if (action.use) {
              action.use(user);
            }
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default ReviewConfig;
