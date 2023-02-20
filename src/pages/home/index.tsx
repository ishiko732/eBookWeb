import { Typography } from "@mui/material";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { useUserContext } from "../../UserContext";
const MyHome = (props: any) => {
  const [status, setStatus] = React.useState(false);
  const { user } = useUserContext();
  return (
    <RequiredRole user={user} status={status} setStatus={setStatus}>
      <Typography> {JSON.stringify(user)}</Typography>
    </RequiredRole>
  );
};

export default MyHome;
