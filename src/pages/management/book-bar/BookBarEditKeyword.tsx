import { TFunction } from "i18next";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import React from "react";
import { book, bookKeyword } from "../../../api/models";
import { Paper } from "@mui/material";
import { Loading } from "../../../components/Loading";
import { MuiChipsInput, MuiChipsInputChip } from "mui-chips-input";
import { addBookKeyWordById, deleteBookKeyWordById } from "../../../api/book";
import { v4 } from "uuid";

const BookBarEditKeyword = ({
  t,
  enqueueSnackbar,
  book,
  setData,
}: {
  t: TFunction<"translation", undefined, "translation">;
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  book: book | null;
  setData: React.Dispatch<React.SetStateAction<book[]>>;
}) => {
  const [message, setMessage] = React.useState<MuiChipsInputChip[]>([]);
  React.useEffect(() => {
    if (book) {
      let keywords: string[] = [];
      book.keywords.forEach((keyword: bookKeyword) => {
        keywords.push(keyword.keyword);
      });
      setMessage(keywords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  const updateData = (chipValue: string, op: "delete" | "add") => {
    if (book) {
      setData((data: book[]) => {
        const index = data.indexOf(book);
        const newData = [...data];
        let keywords: bookKeyword[] = [];
        message.forEach((keyword: string) => {
          keywords.push({
            id: v4() as unknown as number,
            createdAt: "N/A",
            updateAt: "N/A",
            keyword: keyword,
          });
        });
        if (op === "delete") {
          keywords = keywords.filter(
            (keyword) => keyword.keyword !== chipValue
          );
        } else {
          keywords.push({
            id: v4() as unknown as number,
            createdAt: "N/A",
            updateAt: "N/A",
            keyword: chipValue,
          });
        }
        newData[index].keywords = keywords;
        return newData;
      });
    }
  };

  const handleAddChip = (chipValue: string, chipIndex: number) => {
    if (message.indexOf(chipValue) !== -1) {
      enqueueSnackbar(
        t("api.opt_error", { data: t("management.book.edit_repeat") }),
        { variant: "error" }
      );
      return;
    }
    if (book?.id) {
      addBookKeyWordById(book.id as number, [chipValue])
        .then((res) => {
          enqueueSnackbar(t("api.opt_success"), { variant: "success" });
          updateData(chipValue, "add");
        })
        .catch((err) => {
          enqueueSnackbar(t("api.opt_error") + err.msg, { variant: "error" });
          setMessage((message) => {
            return message.filter((data) => data !== chipValue);
          });
          console.log(err);
        });
    }
  };

  const handleDeleteChip = (chipValue: string, chipIndex: number) => {
    if (book?.id) {
      deleteBookKeyWordById(book.id as number, [chipValue])
        .then((res) => {
          enqueueSnackbar(t("api.opt_success"), { variant: "info" });
          updateData(chipValue, "delete");
        })
        .catch((err) => {
          enqueueSnackbar(t("api.opt_error") + err.msg, { variant: "error" });
          setMessage((message) => {
            return [...message, chipValue];
          });
          console.log(err);
        });
    }
  };
  const handleChange = (newValue: MuiChipsInputChip[]) => {
    const setData: Set<string> = new Set();
    newValue.forEach((value) => setData.add(value));
    setMessage(Array.from(setData));
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
    >
      {message ? (
        <MuiChipsInput
          value={message}
          onChange={handleChange}
          onDeleteChip={handleDeleteChip}
          onAddChip={handleAddChip}
          disableEdition
          hideClearAll
          placeholder={t("management.book.edit_text") as string}
          variant="standard"
        />
      ) : (
        <Loading />
      )}
    </Paper>
  );
};

export default BookBarEditKeyword;
