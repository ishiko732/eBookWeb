import { CircularProgress, Stack, Typography } from "@mui/material";
const Loader = (props: {
  text?: string;
  inner?: boolean;
  disabledProgress?: boolean;
}) => {
  return (
    <Stack
      spacing={2}
      sx={{
        position: props.inner ? "absolute" : "fixed",
        display: "flex",
        margin: "auto",
        // width: props.inner ? "50%" : "100vw",
        // height: props.inner ? "50%" : "100vh",
        justifyContent: "center",
        alignItems: "center",
        left: "50%",
        top: "50%",
        zIndex: props.inner ? "999" : "998",
        transform: "translate(-50%, -50%)",
        // backgroundColor: "white",
      }}
    >
      {!props.disabledProgress ? <CircularProgress /> : null}
      {props.text ? <Typography>{props.text}</Typography> : null}
    </Stack>
  );
};

export default Loader;
