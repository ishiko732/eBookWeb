import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Stack, IconButton } from "@mui/material";
import { commentTree, User } from "../../api/models";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export const commentsSecondaryActionHelper = (
  index: number,
  comment: commentTree,
  [open, setOpen]: [boolean[], React.Dispatch<React.SetStateAction<boolean[]>>],
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
  loginUser: User,
  addContent?: true,
  deleteContent?: true
) => {
  const handleClick = (index: number, reload?: boolean) => {
    setOpen((pre) => {
      const newdata = [...pre];
      if (!reload) {
        newdata[index] = !newdata[index];
      } else {
        newdata.splice(index, index + 1);
      }
      return newdata;
    });
  };

  return (
    <Stack direction="row" spacing={2}>
      <IconButton
        edge="start"
        aria-label={`more-${comment.cid}`}
        onClick={() => {
          handleClick(index);
        }}
        color="primary"
      >
        {comment.children && comment.children.length > 0 ? (
          open[index] ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        ) : addContent ? (
          <AddIcon />
        ) : null}
      </IconButton>
      {deleteContent || loginUser.id === comment.uid ? (
        <IconButton
          edge="start"
          aria-label={`delete-${comment.cid}`}
          onClick={(event) => {
            handleClick(index, true);
            setSelected(comment.cid);
            handleSubmit(event, "delete", {
              id: comment.cid,
              comment: null,
            });
          }}
          color="primary"
        >
          <DeleteIcon />
        </IconButton>
      ) : null}
    </Stack>
  );
};
