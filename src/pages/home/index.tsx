import { Typography } from "@mui/material";
import React from "react";
import { useUserContext } from "../../UserContext";
const MyHome = (props: any) => {
  const { user } = useUserContext();
  return (
    <React.Fragment>
      <Typography variant="body2">user:{JSON.stringify(user)}</Typography>
    </React.Fragment>
  );
};

export default MyHome;
