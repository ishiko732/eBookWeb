import { useNavigate } from "react-router-dom";
import { role } from "../api/entity/auth";
import { Loading } from "../components/Loading";
import { default403URL } from "./config";
import React from "react";
import { get_access_token } from "./token";
const RequiredRole = ({
  user,
  requireRole,
  children,
}: {
  user: any;
  requireRole: role[];
  children: JSX.Element;
}) => {
  const [status, setStatus] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user !== null && user !== get_access_token()) {
      if (requireRole.indexOf(user.role) === -1) {
        navigate(default403URL, { replace: true });
      }
      setStatus(true);
    } else {
      setStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return status ? <React.Fragment>{children}</React.Fragment> : <Loading />;
};

export default RequiredRole;
