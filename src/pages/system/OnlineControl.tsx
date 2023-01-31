import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";

const OnlineControl = (props: any) => {
  const [status, setStatus] = React.useState(false);
  const { t } = useTranslation();
  React.useEffect(() => {
    if (status) {
      console.log("已就绪");
    }
  }, [status]);
  return (
    <RequiredRole
      user={props.user}
      requireRole={[role.SUPERADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <div>hello</div>
    </RequiredRole>
  );
};

export default OnlineControl;
