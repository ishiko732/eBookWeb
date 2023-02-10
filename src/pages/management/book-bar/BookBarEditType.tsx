import { TFunction } from "i18next";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import React from "react";
import { book, bookType } from "../../../api/models";
import { Paper } from "@mui/material";
import { Loading } from "../../../components/Loading";
import { MuiChipsInput, MuiChipsInputChip } from "mui-chips-input";
import { addBookTypeById, deleteBookTypeById } from "../../../api/book";
import { v4 } from "uuid";

const BookBarEditType = ({
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
      let types: string[] = [];
      book.types.forEach((type: bookType) => {
        types.push(type.type);
      });
      setMessage(types);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  const updateData = (chipValue: string, op: "delete" | "add") => {
    if (book) {
      setData((data: book[]) => {
        const index = data.indexOf(book);
        const newData = [...data];
        let types: bookType[] = [];
        message.forEach((type: string) => {
          types.push({
            id: v4() as unknown as number,
            createdAt: "N/A",
            updateAt: "N/A",
            type: type,
          });
        });
        if (op === "delete") {
          types = types.filter((type) => type.type !== chipValue);
        } else {
          types.push({
            id: v4() as unknown as number,
            createdAt: "N/A",
            updateAt: "N/A",
            type: chipValue,
          });
        }
        newData[index].types = types;
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
      addBookTypeById(book.id as number, [chipValue])
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
      deleteBookTypeById(book.id as number, [chipValue])
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

export default BookBarEditType;
