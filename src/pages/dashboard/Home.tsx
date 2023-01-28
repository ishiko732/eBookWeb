import React from "react";
import { Grid, Paper } from "@mui/material";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import OutlinedCard from "./Card";
import { info } from "../../api/auth";
import { Loading } from "../../components/Loading";
export default function Home() {
  const [user, setUser]: any = React.useState(null);
  const submittingStatus = React.useRef(true);
  React.useEffect(() => {
    if (submittingStatus.current) {
      submittingStatus.current = false;
      info()
        .then((res: any) => {
          setUser(res);
        })
        .catch((err) => {
          console.log("获取信息失败");
          console.log(err);
        });
    }
  }, []);
  if (user === null) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <OutlinedCard user={user} />
        </Paper>
      </Grid>
    </React.Fragment>
  );
}
