import {
  ListItem,
  IconButton,
  ListItemText,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { TFunction } from "i18next";
import { commentTree } from "../../api/models";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

export const commentsAddHelper = (
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
  return comments.length > 0 && addContent ? (
    <ListItem
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
        ) : null
      }
    >
      <ListItemText
        secondary={
          selected === -1 ? (
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
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {t("comment.notComment_msg")}
              </Typography>
              <IconButton
                edge="start"
                aria-label={`add-new-comment`}
                onClick={(event) => {
                  setSelected(cid || -1);
                }}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Stack>
          )
        }
      />
    </ListItem>
  ) : null;
};
