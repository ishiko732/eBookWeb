import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default class PostionSnackbar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleClose = this.props.onChange.bind(this);
  }

  handleClose() {
    this.props.onChange();
  }

  render(): React.ReactNode {
    const vertical = this.props.vertical || "top";
    const horizontal = this.props.horizontal || "right";
    const { message, severity, hide, open } = this.props;

    return this.props.severity ? (
      <Snackbar
        open={open}
        autoHideDuration={hide || 6000}
        onClose={this.handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={this.handleClose}
          severity={severity || "info"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    ) : (
      <Snackbar
        autoHideDuration={hide || 6000}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={this.handleClose}
        message={message}
        key={vertical + horizontal + "SnackBar"}
      />
    );
  }
}
