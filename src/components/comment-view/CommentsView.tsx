import React from "react";
import { commentTree } from "../../api/models";
import { TFunction } from "i18next";
import List from "@mui/material/List";
import { commentsAddHelper } from "./AddHelper";
import { CommentItemHelper } from "./CommentItemHelper";
import { commentsIsEmptyHelper } from "./IsEmptyHelper";

export const CommentsView = ({
  t,
  comments,
  addContent,
  deleteContent,
  handleSubmit,
}: {
  t: TFunction<"translation", undefined, "translation">;
  comments: commentTree[];
  addContent?: true;
  deleteContent?: true;
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
}) => {
  const [selected, setSelected] = React.useState<number>(0);
  const message = React.useRef<HTMLInputElement>();

  return (
    <List
      disablePadding
      component="nav"
      sx={{
        margin: "0 auto",
        justifyItems: "center",
        width: "100%",
        maxWidth: 600,
        bgcolor: "background.paper",
      }}
    >
      {commentsIsEmptyHelper(
        null,
        comments,
        t,
        [selected, setSelected],
        message,
        handleSubmit,
        addContent
      )}
      <CommentItemHelper
        comments={comments}
        t={t}
        selected={selected}
        setSelected={setSelected}
        message={message}
        handleSubmit={handleSubmit}
        addContent={addContent}
        deleteContent={deleteContent}
      />
      {commentsAddHelper(
        null,
        comments,
        t,
        [selected, setSelected],
        message,
        handleSubmit,
        addContent
      )}
    </List>
  );
};
