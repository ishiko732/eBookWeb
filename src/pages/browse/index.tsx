import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { getShareBooks } from "../../api/share";
import RequiredRole from "../../config/requiredRole";
import { useUserContext } from "../../UserContext";
const BrowseShareBook = () => {
  const [status, setStatus] = React.useState(false);
  const { user } = useUserContext();
  useEffect(() => {
    if (status) {
      getShareBooks(null, "AGREE").then((res) => {
        console.log(res.data);
      });
    }
  }, [status]);
  return (
    <RequiredRole user={user} status={status} setStatus={setStatus}>
      <Typography> {JSON.stringify(user)}</Typography>
    </RequiredRole>
  );
};

export default BrowseShareBook;
