import {
  ListItem,
  ListItemText,
  Typography,
  Collapse,
  List,
  Divider,
} from "@mui/material";
import { TFunction } from "i18next";
import React from "react";
import { commentTree } from "../../api/models";
import { useUserContext } from "../../UserContext";
import { commentsAddHelper } from "./AddHelper";
import { commentsIsEmptyHelper } from "./IsEmptyHelper";
import { commentsSecondaryActionHelper } from "./SecondaryActionHelper";

export const CommentItemHelper = ({
  comments,
  t,
  selected,
  setSelected,
  message,
  handleSubmit,
  addContent,
  deleteContent,
  disiabledDivider,
}: {
  comments: commentTree[];
  t: TFunction<"translation", undefined, "translation">;
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  message: React.MutableRefObject<HTMLInputElement | undefined>;
  handleSubmit: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLSpanElement>,
    op: "add" | "delete",
    message: {
      id?: number | null;
      comment?: string | null;
    }
  ) => void;
  addContent?: true;
  deleteContent?: true;
  disiabledDivider?: boolean;
}) => {
  const [open, setOpen] = React.useState(
    new Array(comments.length).fill(false)
  );
  const { user } = useUserContext();

  return (
    <React.Fragment>
      {comments.map((comment, index) => {
        return (
          <React.Fragment>
            <ListItem
              alignItems="flex-start"
              secondaryAction={commentsSecondaryActionHelper(
                index,
                comment,
                [open, setOpen],
                [selected, setSelected],
                message,
                handleSubmit,
                user,
                addContent,
                deleteContent
              )}
            >
              <ListItemText
                primary={`${comment.user} - ${comment.createdAt}`}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {comment.message}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Collapse in={open[index]} timeout="auto" unmountOnExit>
              <List component="div" sx={{ pl: 4 }}>
                {commentsIsEmptyHelper(
                  comment.cid,
                  comment.children,
                  t,
                  [selected, setSelected],
                  message,
                  handleSubmit,
                  addContent
                )}
                <CommentItemHelper
                  comments={comment.children}
                  t={t}
                  selected={selected}
                  setSelected={setSelected}
                  message={message}
                  handleSubmit={handleSubmit}
                  addContent={addContent}
                  deleteContent={deleteContent}
                  disiabledDivider
                />
                {commentsAddHelper(
                  comment.cid,
                  comment.children,
                  t,
                  [selected, setSelected],
                  message,
                  handleSubmit,
                  addContent
                )}
              </List>
            </Collapse>
            {disiabledDivider ? null : <Divider component="li" flexItem />}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};
