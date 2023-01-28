import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  
class AlertDialog extends React.Component<any,any>{
    constructor(props:any) {
        super(props);
        this.handleOpen = this.props.onChange.bind(this);
    }
    handleOpen(isOpen:boolean,status?:boolean){
        this.props.onChange(isOpen,status)
    }
    render() {
        const {open,title,text,disagree,agree}=this.props
    return (
        <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>{this.handleOpen(false)}}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{this.handleOpen(false,false)}} color="primary">{disagree}</Button>
          <Button onClick={()=>{this.handleOpen(false,true)}} color="error">{agree}</Button>
        </DialogActions>
      </Dialog>
    )
  }
}


export default AlertDialog;