import * as React from "react";
import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues } from "react-hook-form";
import { Login as LoginApi, refreshtoken } from "../../api/auth";
import {
  save_access_token,
  save_refresh_token,
  get_access_token,
  get_refresh_token,
} from "../../config/token";
import { Navigate, useNavigate } from "react-router-dom";
import Copyright from "../../components/Copyright";
import localstorage from "../../config/localstorage";
import { Loading } from "../../components/Loading";
import PostionSnackbar from "../../components/SnackBars";
const theme = createTheme();
export default function Login(props: any) {
  const [isloading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });
  const { onHealth } = props;
  React.useEffect(() => {
    onHealth.current = false;
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const submit = (userInfo: FieldValues) => {
    // userInfo.preventDefault();
    setLoading(true);
    LoginApi({
      name: userInfo.username,
      password: userInfo.password,
    })
      .then((res) => {
        save_access_token(res.data.access_token);
        save_refresh_token(res.data.refresh_token);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
        setLoading(false);
      })
      .catch((err) => {
        setAlert({
          ...alert,
          severity: "error",
          open: true,
          message: err.msg,
        });
        setLoading(false);
      });
  };
  function handleClose() {
    setAlert({ ...alert, open: false });
  }
  const { t } = useTranslation();
  if (get_access_token().length !== 0) {
    return <Navigate replace to="/dashboard" />;
  } else if (localstorage.getItem("remember")) {
    const refresh_token = get_refresh_token();
    if (get_refresh_token().length !== 0) {
      refreshtoken(refresh_token).then((res) => {
        save_access_token(res.data.access_token);
        save_refresh_token(res.data.refresh_token);
        navigate("/dashboard");
      });
      return <Loading />;
    }
  }
  return (
    <ThemeProvider theme={theme}>
      {isloading ? <Loading /> : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("auth.login.login")}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label={t("auth.login.name")}
              {...register("username", {
                required: t("auth.valid.username") as string,
                minLength: {
                  value: 5,
                  message: t("auth.valid.username_minlength") as string,
                },
                maxLength: {
                  value: 10,
                  message: t("auth.valid.username_maxlength") as string,
                },
              })}
              helperText={errors.username?.message?.toString()}
              error={errors.username ? true : false}
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              label={t("auth.login.password")}
              type="password"
              id="password"
              {...register("password", {
                required: t("auth.valid.password") as string,
                minLength: {
                  value: 4,
                  message: t("auth.valid.password_minlength") as string,
                },
              })}
              helperText={errors.password?.message?.toString()}
              error={errors.password ? true : false}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("auth.login.remember")}
              onChange={(event: React.SyntheticEvent, checked: boolean) => {
                event.preventDefault();
                if (checked) {
                  localstorage.setItem("remember", "1", 6000000);
                } else {
                  localstorage.removeItem("remember");
                }
              }}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isloading}
              loadingIndicator={t("auth.login.loadingIndicator")}
              sx={{ mt: 3, mb: 2 }}
            >
              {t("auth.login.login")}
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  {t('auth.login.forgot')}
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {t("auth.login.signup")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <PostionSnackbar
          open={alert.open}
          message={alert.message}
          severity={alert.severity}
          onChange={handleClose}
        />
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
