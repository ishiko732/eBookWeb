import DoneIcon from "@mui/icons-material/Done";
import { Paper, TextField, Divider, Chip } from "@mui/material";
import React from "react";
import { isMac } from "../../utils/getSystem";
import { timer } from "../../utils/sleep";

export const SelectTextContent = ({
  textRef,
}: {
  textRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const [selected, setSelected] = React.useState(false);
  const copyOpt = () => {
    if (!textRef.current) {
      return;
    }
    if (textRef.current.value === "") {
      return;
    }
    navigator.clipboard.writeText(textRef.current.value);
    setSelected(true);
    timer(1000).then(() => {
      setSelected(false);
    });
  };

  React.useEffect(() => {
    const copyText = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "c"
      ) {
        copyOpt();
      }
    };
    window.addEventListener("keyup", copyText);
    return () => {
      window.removeEventListener("keyup", copyText);
    };
  });

  return (
    <Paper elevation={0} variant="outlined" square>
      <TextField
        id="selectText"
        variant="standard"
        inputRef={textRef}
        rows={5}
        maxRows={5}
        fullWidth
        sx={{
          minHeight: document.body.offsetHeight * 0.1,
        }}
        InputProps={{ disableUnderline: true }}
        multiline
        disabled
      />
      <Divider textAlign="right">
        <Chip
          onClick={() => {
            copyOpt();
          }}
          color={selected ? "primary" : undefined}
          variant={selected ? "filled" : "outlined"}
          onDelete={selected ? () => {} : undefined}
          deleteIcon={<DoneIcon />}
          label={isMac ? "⌘C" : "Ctrl-C"}
        />
      </Divider>
    </Paper>
  );
};
