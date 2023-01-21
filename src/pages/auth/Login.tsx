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
import { Login as LoginApi } from "../../api/auth";
import {
  save_access_token,
  save_refresh_token,
  get_access_token,
} from "../../config/token";
import { Navigate, useNavigate } from "react-router-dom";
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
    console.log(userInfo);
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
        console.log(res);
      })
      .catch((err) => {
        console.log("登录失败");
        console.log(err);
      });
  };
  const { t, i18n } = useTranslation();
  if (Object.keys(get_access_token()).length !== 0) {
    return <Navigate replace to="/dashboard" />;
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
            {t("login")}
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
              label={t("name")}
              {...register("username", {
                required: "请输入用户名",
                minLength: {
                  value: 5,
                  message: "用户名至少为5位",
                },
                maxLength: {
                  value: 10,
                  message: "用户名最多为10位",
                },
              })}
              helperText={errors.username?.message?.toString()}
              error={errors.username ? true : false}
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              label={t("password")}
              type="password"
              id="password"
              {...register("password", {
                required: "请输入密码",
                minLength: {
                  value: 4,
                  message: "密码至少为4位",
                },
              })}
              helperText={errors.password?.message?.toString()}
              error={errors.password ? true : false}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("RememberMe")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <div>
          <Button
            fullWidth
            onClick={() =>
              i18n.changeLanguage(i18n.language === "en_US" ? "zh_CN" : "en_US")
            }
          >
            {i18n.language === "en_US" ? t("transfer_cn") : t("transfer_en")}
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
}
