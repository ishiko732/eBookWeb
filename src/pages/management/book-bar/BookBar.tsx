import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { bookOpType } from "../BookControl";
import { Loading } from "../../../components/Loading";
import BookBarUser from "./BookBarUser";
import { book } from "../../../api/models";
import BookBarEditType from "./BookBarEditType";
import BookBarEditKeyword from "./BookBarEditKeyword";

const BookBar = ({
  op,
  bookId,
  book,
  setData,
}: {
  op: bookOpType;
  bookId: number | null;
  book: book | null;
  setData: React.Dispatch<React.SetStateAction<book[]>>;
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  switch (op) {
    case "viewFile":
      return (
        <BookBarUser
          t={t}
          enqueueSnackbar={enqueueSnackbar}
          bookId={bookId as number}
          sourceId={book?.mid || null}
        />
      );
    case "editType":
      return (
        <BookBarEditType
          t={t}
          enqueueSnackbar={enqueueSnackbar}
          book={book}
          setData={setData}
        />
      );
    case "editKeyword":
      return (
        <BookBarEditKeyword
          t={t}
          enqueueSnackbar={enqueueSnackbar}
          book={book}
          setData={setData}
        />
      );
  }

  return <Loading />;
};

export default BookBar;
