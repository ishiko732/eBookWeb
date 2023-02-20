import { useTranslation } from "react-i18next";
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { book, shareBook } from "../../api/models";
import { TreeData } from "../tree-view/CustomTreeView";
import { Loading } from "../Loading";
import {
  getBookByResourceId,
  updateBook,
  updateBookTypeAndKeywordById,
} from "../../api/book";
import { v4 } from "uuid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { defaultDateFormat, defaultLanguage } from "../../config/config";
import { adapterLocale, localeTextConstants } from "../../locales/datePicker";
import "dayjs/locale/zh-cn";
import "dayjs/locale/ja";
import "dayjs/locale/en";
import { MuiChipsInput, MuiChipsInputChip } from "mui-chips-input";
import { DialogMessage } from "./InputDialog";
import LoadingButton from "@mui/lab/LoadingButton";
import { HttpStatusCode } from "../../utils/StatusCode";
import { useSnackbar } from "notistack";
import { addShareBook } from "../../api/share";
import Button from "@mui/material/Button";

const ShareDialogPart = ({
  node,
  dialogMessage,
  handleClose,
  sharebook,
}: {
  node: TreeData[];
  dialogMessage: DialogMessage;
  handleClose: (
    event: React.SyntheticEvent<unknown>,
    reason?: string,
    dialogMessage?: DialogMessage,
    text?: string
  ) => void;
  sharebook?: shareBook;
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = React.useState<book | null>(null);
  const [fileId, setFileId] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [author, setAuthor] = React.useState<string>("");
  const [subject, setSubject] = React.useState<string>("");
  const [creator, setCreator] = React.useState<string>("");
  const [creationDate, setCreationDate] = React.useState<Dayjs | null>(dayjs());
  const [types, setTypes] = React.useState<string[]>([]);
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const firstStatus = React.useRef(true);

  const setView = (book: book) => {
    setMessage(book);
    book.title && setTitle(book.title);
    book.author && setAuthor(book.author);
    book.subject && setSubject(book.subject);
    book.creator && setCreator(book.creator);
    book.creationDate &&
      setCreationDate(dayjs(book.creationDate, defaultDateFormat));
    if (book.types && book.types.length > 0) {
      setTypes(book.types.map((type) => type.type));
    }
    if (book.keywords && book.keywords.length > 0) {
      setKeywords(book.keywords.map((keyword) => keyword.keyword));
    }
  };

  React.useEffect(() => {
    if (!firstStatus.current) {
      return;
    }
    firstStatus.current = false;
    if (node.at(-1)?.resoureId) {
      getBookByResourceId(node.at(-1)?.resoureId!)
        .then((res) => {
          const book: book = res.data[0];
          setFileId(Number(node.at(-1)!.id.split("_").at(-1))!);
          setView(book);
        })

        .catch((err) => {
          console.log(err);
        });
    }
    if (sharebook) {
      setLoading(true);
      setFileId(sharebook.file.id);
      setView(sharebook.book);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  return (
    <React.Fragment>
      <DialogContent>
        {loading && !sharebook ? <CircularProgress /> : null}
        <ShareContent
          t={t}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          subject={subject}
          setSubject={setSubject}
          creator={creator}
          setCreator={setCreator}
          creationDate={creationDate}
          setCreationDate={setCreationDate}
          types={types}
          setTypes={setTypes}
          keywords={keywords}
          setKeywords={setKeywords}
          loading={loading}
        />
      </DialogContent>
      <DialogActions>
        {sharebook ? (
          <Button
            variant="contained"
            onClick={(e) => handleClose(e)}
            sx={{ mt: 1, mr: 1 }}
          >
            {t("management.review.viewReview.Finish")}
          </Button>
        ) : (
          <React.Fragment>
            <LoadingButton
              onClick={(e) => {
                handleClose(e);
              }}
              variant="contained"
              color="inherit"
              loading={loading}
            >
              {dialogMessage.no}
            </LoadingButton>
            <LoadingButton
              onClick={(e) => {
                if (!message) {
                  return;
                }
                setLoading(true);
                (async function () {
                  const bookid = message.id;
                  const _type = message.types.map((type) => type.type);
                  const _keyword = message.keywords.map(
                    (keyword) => keyword.keyword
                  );

                  const deleteType = _type.filter(
                    (type) => types.indexOf(type) === -1
                  );
                  const deleteKeyword = _keyword.filter(
                    (keyword) => keywords.indexOf(keyword) === -1
                  );

                  const update_op1: any = await updateBook({
                    id: bookid,
                    author: author,
                    title: title,
                    subject: subject,
                    creator: creator,
                    creationDate:
                      creationDate?.format(defaultDateFormat) || null,
                    mid: "",
                    keywords: [],
                    types: [],
                  });
                  if (update_op1.code !== HttpStatusCode.Ok) {
                    enqueueSnackbar(
                      t("api.opt_error", { data: update_op1.msg }),
                      {
                        variant: "error",
                      }
                    );
                    return;
                  }
                  const update_op2: any = await updateBookTypeAndKeywordById(
                    bookid,
                    types,
                    deleteType,
                    keywords,
                    deleteKeyword
                  );
                  if (update_op2.code !== HttpStatusCode.Ok) {
                    enqueueSnackbar(
                      t("api.opt_error", { data: update_op1.msg }),
                      {
                        variant: "error",
                      }
                    );
                    return;
                  }
                  await addShareBook(fileId)
                    .then(() => {
                      enqueueSnackbar(t("api.opt_success"), {
                        variant: "success",
                      });
                    })
                    .catch(() => {
                      enqueueSnackbar(
                        t("api.opt_error", { data: update_op1.msg }),
                        {
                          variant: "error",
                        }
                      );
                    });
                })();
                setLoading(false);
                handleClose(e, "escapeKeyDown", dialogMessage);
              }}
              variant="contained"
              color={"success"}
              loading={loading}
            >
              {dialogMessage.yes}
            </LoadingButton>
          </React.Fragment>
        )}
      </DialogActions>
    </React.Fragment>
  );
};

export const ShareContent = ({
  t,
  title,
  setTitle,
  author,
  setAuthor,
  subject,
  setSubject,
  creator,
  setCreator,
  creationDate,
  setCreationDate,
  types,
  setTypes,
  keywords,
  setKeywords,
  loading,
}: any) => {
  const handleChange = (
    newValue: MuiChipsInputChip[],
    type: "type" | "keyword"
  ) => {
    const setData: Set<string> = new Set();
    newValue.forEach((value) => setData.add(value));
    if (type === "type") {
      setTypes(Array.from(setData));
    } else {
      setKeywords(Array.from(setData));
    }
  };

  return (
    <Stack
      // component="form"
      sx={{
        width: "50ch",
      }}
      spacing={2}
      // noValidate
      // autoComplete="off"
    >
      <TextField
        id="input_title"
        label={t("management.book.bookField.title")}
        variant="standard"
        value={title}
        onChange={(e) => !loading && setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        id="input_author"
        label={t("management.book.bookField.author")}
        variant="standard"
        value={author}
        onChange={(e) => !loading && setAuthor(e.target.value)}
        fullWidth
      />
      <TextField
        id="input_subject"
        label={t("management.book.bookField.subject")}
        variant="standard"
        value={subject}
        onChange={(e) => !loading && setSubject(e.target.value)}
        multiline
        fullWidth
      />
      <TextField
        id="input_creator"
        label={t("management.book.bookField.creator")}
        variant="standard"
        value={creator}
        onChange={(e) => !loading && setCreator(e.target.value)}
        fullWidth
      />
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={adapterLocale(localStorage.language || defaultLanguage)}
        localeText={localeTextConstants(
          localStorage.language || defaultLanguage
        )}
      >
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label={t("management.book.bookField.creationDate")}
          value={creationDate}
          onChange={(newValue) => {
            !loading && setCreationDate(newValue);
          }}
          inputFormat={defaultDateFormat}
        />
      </LocalizationProvider>
      <Typography mt={2}>{t("management.book.bookField.types")}</Typography>
      <MuiChipsInput
        value={types}
        onChange={(value) => !loading && handleChange(value, "type")}
        disableEdition
        hideClearAll
        placeholder={t("management.book.edit_text") as string}
        variant="standard"
        fullWidth
      />
      <Typography mt={2}>{t("management.book.bookField.keywords")}</Typography>
      <MuiChipsInput
        value={keywords}
        onChange={(value) => !loading && handleChange(value, "keyword")}
        disableEdition
        hideClearAll
        placeholder={t("management.book.edit_text") as string}
        variant="standard"
        fullWidth
      />
    </Stack>
  );
};

export default ShareDialogPart;
