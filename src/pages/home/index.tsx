import { Typography } from "@mui/material";
import React from "react";
const MyHome = (props: any) => {
  const { user } = props;
  return (
    <React.Fragment>
      <Typography variant="body2">user:{JSON.stringify(user)}</Typography>
    </React.Fragment>
  );
};

export default MyHome;
