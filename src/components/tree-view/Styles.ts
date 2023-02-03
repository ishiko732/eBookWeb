import { createTheme } from "@mui/material";

export const getMuiTheme = () =>
  createTheme({
    palette: {
      primary: {
        main: "#2160dd",
      },
      secondary: {
        main: "#d3d3d3",
      },
    },
  });
