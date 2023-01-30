import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import RequiredRole from "../../config/requiredRole";

const SystemControl = (props: any) => {
  const { t } = useTranslation();
  return (
    <RequiredRole user={props.user} requireRole={[role.SUPERADMIN]}>
      <div>hello</div>
    </RequiredRole>
  );
};

export default SystemControl;
