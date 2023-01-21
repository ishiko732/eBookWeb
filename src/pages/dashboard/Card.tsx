import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { get_access_token, get_refresh_token } from "../../config/token";

// const card = (
//   <React.Fragment>
//     <CardContent>
//       <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//         message
//       </Typography>
//       <Typography sx={{ mb: 1.5 }} color="text.secondary">
//       access_token:{get_access_token()}<br/>
//         refresh_token:{get_refresh_token()}
//       </Typography>
//       <Typography variant="body2">
//         {/* user:{JSON.stringify(user)} */}
//         texs
//         <br />
//         {'"a benevolent smile"'}
//       </Typography>
//     </CardContent>
//     <CardActions>
//       <Button size="small">Learn More</Button>
//     </CardActions>
//   </React.Fragment>
// );
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);
const card = (user: any) => (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Word of the Day
      </Typography>
      <Typography variant="h5" component="div">
        be{bull}nev{bull}o{bull}lent
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        access_token:{get_access_token()}
        <br />
        refresh_token:{get_refresh_token()}
      </Typography>
      <Typography variant="body2">
        user:{JSON.stringify(user)}
        <br />
        {'"a benevolent smile"'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);

export default function OutlinedCard({ user }: any) {
  console.log(user);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card(user)}</Card>
    </Box>
  );
}
