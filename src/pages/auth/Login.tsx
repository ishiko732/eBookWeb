import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
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
import SelectLanguage from "../../components/Language";

const theme = createTheme();
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const submit = (userInfo: FieldValues) => {
    // userInfo.preventDefault();
    LoginApi({
      name: userInfo.username,
      password: userInfo.password,
    }).then((res) => {
      save_access_token(res.data.access_token);
      save_refresh_token(res.data.refresh_token);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
      console.log(res);
    });
  };
  const { t } = useTranslation();
  if (get_access_token().length !== 0) {
    return <Navigate replace to="/dashboard" />;
  } else if (localStorage.getItem("remember")) {
    const refresh_token = get_refresh_token();
    if (get_refresh_token().length !== 0) {
      refreshtoken(refresh_token).then((res) => {
        save_access_token(res.data.access_token);
        save_refresh_token(res.data.refresh_token);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
        console.log(res);
      });
    }
  }
  return (
    <ThemeProvider theme={theme}>
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
                required: t("auth.login.valid_username") as string,
                minLength: {
                  value: 5,
                  message: t("auth.login.valid_username_minlength") as string,
                },
                maxLength: {
                  value: 10,
                  message: t("auth.login.valid_username_maxlength") as string,
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
                required: t("auth.login.valid_password") as string,
                minLength: {
                  value: 4,
                  message: t("auth.login.valid_password_minlength") as string,
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
                  localStorage.setItem("remember", "1");
                } else {
                  localStorage.removeItem("remember");
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("auth.login.login")}
            </Button>
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
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <SelectLanguage />
      </Container>
    </ThemeProvider>
  );
}
