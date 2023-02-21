import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { shareBook } from "../../api/models";
import { getShareBooks } from "../../api/share";
import RequiredRole from "../../config/requiredRole";
import { useUserContext } from "../../UserContext";
import BroweseBook from "./BroweseBook";
const BrowseShareBook = () => {
  const [status, setStatus] = React.useState(false);
  const [shareBooks, setShareBooks] = React.useState<shareBook[]>([]);
  const { user } = useUserContext();
  useEffect(() => {
    if (status) {
      getShareBooks(null, "AGREE").then((res) => {
        setShareBooks(res.data);
        console.log(res.data);
      });
    }
  }, [status]);
  return (
    <RequiredRole user={user} status={status} setStatus={setStatus}>
      <BroweseBook books={shareBooks} />
      {/* <Typography> {JSON.stringify(shareBooks)}</Typography> */}
    </RequiredRole>
  );
};

export default BrowseShareBook;
