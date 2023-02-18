import { DefaultTFuncReturn, t, TFunction } from "i18next";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import React, { Dispatch, SetStateAction } from "react";
import {
  file,
  reviewStatus,
  reviewStatusType,
  shareBook,
  User,
} from "../../../api/models";
import { getFileByResourceId } from "../../../api/file";
import { userById } from "../../../api/user";
import {
  Chip,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Loading } from "../../../components/Loading";
import Button from "@mui/material/Button";
import { Transition } from "../../../components/AlertDialog";
import ShareDialogPart from "../../../components/file-tree/ShareDialog";
import { DialogMessage } from "../../../components/file-tree/InputDialog";
import { stepContent, StepView } from "../../../components/StepView";
import { checkShareBook } from "../../../api/share";

const useSteps = (
  sharebook: shareBook,
  t: TFunction<"translation", undefined, "translation">,
  time: string[],
  [status, setStatus]: [
    reviewStatusType,
    Dispatch<SetStateAction<reviewStatusType>>
  ],
  [reviewMessage, setMessage]: [string, Dispatch<SetStateAction<string>>]
): stepContent[] => {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    userById(sharebook.file.uid).then((res) => setUser(res.data));
  }, []);
  const DialogMessage: any = {
    title: t("TreeView.Share", { type: t(`TreeView.PDF`) }),
    context: t("TreeView.Input", { type: t(`TreeView.PDF`) }),
    type: "PDF",
    yes: t("TreeView.YES", { opt: t(`TreeView.opt.Share`) }),
    no: t("TreeView.NO"),
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setOpen(false);
    }
  };
  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    dialogMessage?: DialogMessage,
    text?: string
  ) => {
    setOpen(false);
  };
  return user
    ? [
        {
          label: t("management.review.viewReview.create"),
          time: time[0],
        },
        {
          label: t("management.review.viewReview.review"),
          description: t("management.review.viewReview.message"),
          op: (
            <React.Fragment>
              <Typography>{`${t("auth.register.name")}:${user.name}(${
                user.id
              })`}</Typography>
              <Stack direction="row" spacing={0}>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={(e) => {
                    const win = window.open(
                      `/views?resource=${sharebook.file.fsId}`,
                      "_blank"
                    );
                    win?.focus();
                  }}
                >
                  {t("management.book.op.view")}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={(e) => {
                    setOpen(true);
                  }}
                >
                  {t("management.book.op.book")}
                </Button>
              </Stack>
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={Transition}
                onKeyUp={handleKeyUp}
              >
                <DialogTitle>{DialogMessage.title}</DialogTitle>
                <ShareDialogPart
                  node={[]}
                  dialogMessage={DialogMessage}
                  handleClose={handleClose}
                  sharebook={sharebook}
                />
              </Dialog>
            </React.Fragment>
          ),
        },
        {
          label: t("management.review.viewReview.finish"),
          time: time[0] === time[1] ? null : time[1],
          op: (
            <Stack spacing={2}>
              <Select
                labelId="select-label-review"
                id="select-label-review"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as reviewStatusType);
                }}
                error={reviewStatus.indexOf(status) === -1}
                variant={"standard"}
              >
                {reviewStatus.map((key) => {
                  return (
                    <MenuItem value={key}>
                      <Chip
                        label={t(`management.review.status.${key}`)}
                        color={
                          (t(`management.review.color.${key}`) as any) || "info"
                        }
                      />
                    </MenuItem>
                  );
                })}
              </Select>
              <TextField
                id="input-review-message"
                label={t("management.review.viewReview.review_message")}
                variant="standard"
                value={reviewMessage}
                onChange={(event) => setMessage(event.target.value)}
                error={reviewMessage === ""}
              />
            </Stack>
          ),
        },
      ]
    : [];
};

const BookBarShare = ({
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
  const [status, setStatus] = React.useState<reviewStatusType>(
    sharebook.review.status
  );
  const [reviewMessage, setMessage] = React.useState(
    sharebook.review.comment || ""
  );
  const content = useSteps(
    sharebook,
    t,
    [sharebook.createdAt, sharebook.review.updateAt],
    [status, setStatus],
    [reviewMessage, setMessage]
  );

  const handleSubmit = (submit: boolean) => {
    if (submit) {
      checkShareBook(sharebook.book.id, status, reviewMessage)
        .then(() => {
          enqueueSnackbar(t("api.opt_success"), {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar(t("api.opt_error", { data: err.msg }), {
            variant: "error",
          });
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
      }}
    >
      {content ? (
        <StepView
          t={t}
          content={content}
          error_finish={sharebook.review.status === "REVOKE" || false}
          firstStep={sharebook.review.status === "WAIT" ? 1 : 3}
          handleSubmit={handleSubmit}
          submit_error={reviewMessage === ""}
        />
      ) : (
        <Loading />
      )}
    </Paper>
  );
};

export default BookBarShare;
