import { role, updatePasswordVo} from "../../api/entity/auth";
import { useTranslation } from "react-i18next";
import {
  Stack,
  Button,
  IconButton,
  Typography,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Input,
  InputAdornment,
} from "@mui/material";
import * as React from "react";
import { User } from "../../api/models";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import { Transition } from "../../components/AlertDialog";

const UpdatePassword = ({
  open,
  handleClose,
  updateUid,
  loginUser,
}: {
  open: boolean;
  handleClose: (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    password?: updatePasswordVo
  ) => void;
  updateUid: number;
  loginUser: User;
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const login_role = loginUser.role;
  const [rawPassword, setRawPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const manger = [role.SUPERADMIN, role.ADMIN];

  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>{t("management.user.updatePassword")}</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2}>
          {manger.indexOf(login_role) !== -1 ? (
            <Typography>{t("management.user.updatePassword_Tip")}</Typography>
          ) : null}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="raw_password">
              {t("management.user.rawPassword")}
            </InputLabel>
            <Input
              id="raw_password"
              type={showPassword ? "text" : "password"}
              value={
                manger.indexOf(login_role) === -1 ? rawPassword : newPassword
              }
              onChange={(e) => setRawPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="new_password">
              {t("management.user.newPassword")}
            </InputLabel>
            <Input
              id="new_password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="repeat_password">
              {t("management.user.repeatPassword")}
            </InputLabel>
            <Input
              id="repeat_password"
              type={showPassword ? "text" : "password"}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            handleClose(e);
          }}
          variant="outlined"
        >
          {t("management.user.update_no")}
        </Button>
        <Button
          onClick={(e) => {
            if (newPassword !== repeatPassword) {
              enqueueSnackbar(t("management.user.password_check"), {
                variant: "warning",
              });
              e.preventDefault();
              return;
            }
            handleClose(e, "escapeKeyDown", {
              uid: updateUid,
              rawPassword: rawPassword,
              newPassword: newPassword,
            });
          }}
          variant="outlined"
          color="error"
        >
          {t("management.user.update_ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePassword;
