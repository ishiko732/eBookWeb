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
import Copyright from "../../components/Copyright";
import { useTranslation } from "react-i18next";
import { Controller, useForm, FieldValues } from "react-hook-form";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

const theme = createTheme();

export default function SignUp() {
  const [checked, setChecked] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();

  const submit = (registerVo: FieldValues) => {
    console.log(registerVo);
  };

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
            {t("auth.register.register")}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(submit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  control={control as any}
                  rules={{ validate: matchIsValidTel }}
                  render={({ field, fieldState }) => (
                    <MuiTelInput
                      {...field}
                      fullWidth
                      focusOnSelectCountry
                      defaultCountry="CN"
                      onlyCountries={["CN", "US", "JP"]}
                      preferredCountries={["CN"]}
                      helperText={
                        fieldState.invalid ? t("auth.valid.phone") : ""
                      }
                      error={fieldState.invalid}
                    />
                  )}
                  name="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label={t("auth.register.name")}
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label={t("auth.register.password")}
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
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label={t("auth.register.readed")}
                  onChange={() => setChecked(!checked)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!checked}
            >
              {t("auth.register.register")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  {t("auth.register.login")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
