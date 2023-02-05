import { useTranslation } from "react-i18next";
import {
  Stack,
  Button,
  IconButton,
  Typography,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Input,
  InputAdornment,
} from "@mui/material";
import * as React from "react";
import { Transition } from "../AlertDialog";
import { FileMenuType } from "./FileMenu";

export interface DialogMessage {
  open: boolean;
  title: string;
  context: string;
  type: FileMenuType;
  yes: string;
  no: string;
  preValue?: string;
}
const InputDialog = ({
  dialogMessage,
  handleClose,
}: {
  dialogMessage: DialogMessage;
  handleClose: (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    dialogMessage?: DialogMessage,
    text?: string
  ) => void;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    setValue(dialogMessage.preValue || "");
  }, [dialogMessage]);
  return (
    <Dialog
      disableEscapeKeyDown
      open={dialogMessage.open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>{dialogMessage.title}</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2}>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="input_value">
              {dialogMessage.context}
            </InputLabel>
            <Input
              id="input_value"
              type={"text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            handleClose(e);
          }}
          variant="contained"
          color="inherit"
        >
          {dialogMessage.no}
        </Button>
        <Button
          onClick={(e) => {
            handleClose(e, "escapeKeyDown", dialogMessage, value);
          }}
          variant="contained"
          color="success"
        >
          {dialogMessage.yes}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;
