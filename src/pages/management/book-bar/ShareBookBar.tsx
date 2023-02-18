import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { Loading } from "../../../components/Loading";
import { shareBook } from "../../../api/models";
import { bookOpType } from "./inex";
import BookBarShare from "./BookBarShare";
import React from "react";
import BookBarComment from "./BookBarComment";

const ShareBookBar = ({
  op,
  shareBook,
  setData,
}: {
  op: bookOpType;
  shareBook: shareBook | null;
  setData: React.Dispatch<React.SetStateAction<shareBook[]>>;
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  if (shareBook) {
    switch (op) {
      case "viewReview":
        return (
          <BookBarShare
            t={t}
            enqueueSnackbar={enqueueSnackbar}
            sharebook={shareBook}
          />
        );
      case "viewComment":
        return (
          <BookBarComment
            t={t}
            enqueueSnackbar={enqueueSnackbar}
            sharebook={shareBook}
          />
        );
    }
  }
  return <Loading />;
};

export default ShareBookBar;
