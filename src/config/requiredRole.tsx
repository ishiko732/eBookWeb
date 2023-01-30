import { useNavigate } from "react-router-dom";
import { role } from "../api/entity/auth";
import { Loading } from "../components/Loading";
import { defaultRole } from "./config";
import React from "react";
const RequiredRole = ({
  user,
  requireRole,
  children,
}: {
  user: any;
  requireRole: role[];
  children: JSX.Element;
}) => {
  const r = user?.role || defaultRole;
  const navigate = useNavigate();
  if (requireRole.indexOf(r) === -1) {
    navigate("/exception/403", { replace: true });
    return <Loading />;
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default RequiredRole;
