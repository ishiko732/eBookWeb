import dayjs from "dayjs";
import React from "react";
import { DFS_Delete2 } from "../../algorithm/graph";
import { commentToTree } from "../../algorithm/tree";
import { shareBook, commentTree } from "../../api/models";
import {
  getShareBookComments,
  addShareBookComment,
  deleteShareBookComment,
} from "../../api/share";
import { defaultDateFormat } from "../../config/config";
import { useUserContext } from "../../UserContext";
import { CommentsView } from "./CommentsView";

export const CommentContent = ({ item }: { item: shareBook }) => {
  const { t, user } = useUserContext();
  const [comments, setComments] = React.useState<commentTree[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const firstStatus = React.useRef(true);
  React.useEffect(() => {
    if (!firstStatus.current) {
      return;
    }
    firstStatus.current = false;
    getShareBookComments(item.book.id).then((res) => {
      setComments(res.data);
      setLoaded(true);
    });
  }, []);

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
        bid: item.book.id,
        uid: user.id,
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
          item.book.id,
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
      deleteShareBookComment(item.book.id, message.id).then((res) => {
        console.log(res.data);
      });
    }
  };
  return loaded ? (
    <CommentsView
      t={t}
      comments={comments}
      handleSubmit={handleSubmit}
      addContent={item.review.status === "AGREE" ? true : undefined}
    />
  ) : null;
};
