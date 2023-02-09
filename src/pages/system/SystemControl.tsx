// import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import React from "react";
import RequiredRole from "../../config/requiredRole";
import { redisCache, systemHealth, systemMessage } from "../../api/system";
import { Box, Divider, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Information from "./Information";
import ServeStatus from "./ServeStatus";
import DiskStatus from "./DiskStatus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const SystemControl = (props: any) => {
  const {
    mainOpen,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMainOpen,
  }: {
    mainOpen: boolean;
    setMainOpen: React.Dispatch<React.SetStateAction<boolean>>;
  } = props;
  const [status, setStatus] = React.useState(false);
  const [message, setmessage] = React.useState({
    cpu: "N/A",
    os: "N/A",
    version: "N/A",
    macos: false,
    windows: false,
    linux: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [redis, setRedis] = React.useState<any>(null);
  const [sHealth, setSHealth] = React.useState<any>(null);

  React.useEffect(() => {
    if (status) {
      systemMessage()
        .then((res) => {
          setmessage(res.data);
        })
        .catch((err) => {
          console.log(err.data);
        });
      redisCache()
        .then((res) => {
          setRedis(res.data);
        })
        .catch((err) => {
          console.log(err.data);
        });
      systemHealth()
        .then((res) => {
          setSHealth(res.data);
        })
        .catch((err) => {
          console.log(err.data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <RequiredRole
      user={props.user}
      requireRole={[role.SUPERADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={mainOpen ? 6 : 4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <Information message={message} />
              <Divider sx={{ my: 1, alignItems: "center" }} />
              <ServeStatus health={sHealth} />
            </Paper>
          </Grid>
          <Grid item xs={6} md={mainOpen ? 6 : 8}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <DiskStatus message={sHealth?.components?.diskSpace} />
            </Paper>
            <Divider
              style={{ backgroundColor: "red" }}
              orientation="vertical"
              flexItem
            />
          </Grid>
          {/* <Grid item xs={12}>
            <Item> <Typography >{JSON.stringify(redis)}</Typography></Item>
          </Grid> */}
        </Grid>
      </Box>
    </RequiredRole>
  );
};

export default SystemControl;
