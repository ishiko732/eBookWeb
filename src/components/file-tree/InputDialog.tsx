import { useTranslation } from "react-i18next";
import {
  Stack,
  Button,
  Typography,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Input,
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

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && value !== "") {
      handleClose(e, "escapeKeyDown", dialogMessage, value);
    }
  };

  React.useEffect(() => {
    setValue(dialogMessage.preValue || "");
  }, [dialogMessage]);
  return (
    <Dialog
      // disableEscapeKeyDown
      open={dialogMessage.open}
      onClose={handleClose}
      TransitionComponent={Transition}
      onKeyUp={handleKeyUp}
    >
      <DialogTitle>{dialogMessage.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {dialogMessage.type === "Delete" ? (
            <Typography>
              {t("TreeView.Tip", { type: t(`TreeView.opt.Delete`) })}
            </Typography>
          ) : (
            <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
              <InputLabel htmlFor="input_value">
                {dialogMessage.context}
              </InputLabel>
              <Input
                id="input_value"
                type={"text"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
              />
            </FormControl>
          )}
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
          color={dialogMessage.type === "Delete" ? "error" : "success"}
        >
          {dialogMessage.yes}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;
