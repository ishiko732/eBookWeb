import { TFunction } from "i18next";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import React, { useEffect } from "react";
import { commentTree, shareBook } from "../../../api/models";
import {
  addShareBookComment,
  getShareBookComments,
  deleteShareBookComment,
} from "../../../api/share";
import Title from "../../../components/Title";
import { Paper } from "@mui/material";
import { commentToTree } from "../../../algorithm/tree";
import dayjs from "dayjs";
import { defaultDateFormat } from "../../../config/config";
import { CommentsView } from "../../../components/comment-view/CommentsView";
import { DFS_Delete2 } from "../../../algorithm/graph";
import { useUserContext } from "../../../UserContext";

const BookBarComment = ({
  t,
  enqueueSnackbar,
  sharebook,
}: {
  t: TFunction<"translation", undefined, "translation">;
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  sharebook: shareBook;
}) => {
  const [comments, setComments] = React.useState<commentTree[]>([]);
  const { user } = useUserContext();
  useEffect(() => {
    if (sharebook) {
      getShareBookComments(sharebook.book.id)
        .then((res) => {
          setComments(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [sharebook]);
  const handleSubmit = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLSpanElement>,
    op: "add" | "delete",
    message: {
      id?: number | null;
      comment?: string | null;
    }
  ) => {
    if (op === "add" && message.comment) {
      const time = dayjs();
      const temp = commentToTree([...comments], message.id || null, {
        cid: time.unix(),
        bid: sharebook.book.id,
        uid:user.id,
        user: user.name || (t("comment.myself") as string),
        createdAt: time.format(defaultDateFormat),
        updateAt: time.format(defaultDateFormat),
        parentId: message.id || null,
        message: message.comment,
        children: [],
      });
      (async (comment: string) => {
        setComments(temp);
        await addShareBookComment(
          sharebook.book.id,
          comment,
          message.id || null
        ).then((res) => {
          setComments(res.data);
        });
      })(message.comment);
    } else if (op === "delete" && message.id) {
      setComments((pre) => {
        const newdata = [...pre];
        DFS_Delete2(newdata, "cid", message.id, "children");
        return newdata;
      });
      deleteShareBookComment(sharebook.book.id, message.id).then((res) => {
        console.log(res.data);
      });
    }
  };
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "auto",
        maxHeight: "700px",
      }}
    >
      <Title sx={{ margin: "0 auto" }}>{t("comment.comment")}</Title>
      <CommentsView
        t={t}
        comments={comments}
        addContent={sharebook.review.status === "AGREE" ? true : undefined}
        deleteContent={sharebook.review.status === "AGREE" ? true : undefined}
        handleSubmit={handleSubmit}
      />
    </Paper>
  );
};

export default BookBarComment;
