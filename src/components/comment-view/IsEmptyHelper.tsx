import { TFunction } from "i18next";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { commentTree } from "../../api/models";

export const commentsIsEmptyHelper = (
  cid: number | null,
  comments: commentTree[],
  t: TFunction<"translation", undefined, "translation">,
  [selected, setSelected]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ],
  message: React.MutableRefObject<HTMLInputElement | undefined>,
  handleSubmit: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLSpanElement>,
    op: "add" | "delete",
    message: {
      id?: number | null;
      comment?: string | null;
    }
  ) => void,
  addContent?: true
) => {
  return comments.length === 0 && addContent ? (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        selected === (cid || -1) ? (
          <IconButton
            edge="start"
            aria-label="send-first"
            onClick={(e) => {
              setSelected(0);
              handleSubmit(e, "add", {
                id: cid,
                comment: message.current?.value || "",
              });
            }}
            color="primary"
          >
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            aria-label="add"
            onClick={() => setSelected(cid || -1)}
            color="primary"
          >
            <AddIcon />
          </IconButton>
        )
      }
    >
      <ListItemText
        primary={
          selected === (cid || -1)
            ? t("comment.newCommnet")
            : t("comment.notComment")
        }
        secondary={
          selected === (cid || -1) ? (
            <TextField
              id="add-first-comment"
              label={t("comment.notComment_msg")}
              variant="standard"
              type={"text"}
              inputRef={message}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  setSelected(0);
                  handleSubmit(event, "add", {
                    id: cid,
                    comment: message.current?.value || "",
                  });
                }
              }}
              autoFocus
              fullWidth
            />
          ) : (
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {t("comment.notComment_msg")}
            </Typography>
          )
        }
      />
    </ListItem>
  ) : null;
};
