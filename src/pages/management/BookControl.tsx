// noinspection JSUnusedLocalSymbols,JSIgnoredPromiseFromCall

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import { book } from "../../api/models";
import Title from "../../components/Title";
import RequiredRole from "../../config/requiredRole";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getBookList } from "../../api/book";
import BookDataTable from "./BookDataTable";
import PositionSwipeableDrawer from "../../components/PositionSwipeableDrawer";
import BookBar from "./book-bar/BookBar";
import { bookOpType } from "./book-bar/inex";

const BookControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<book[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [restart, setRestart] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [type, setType] = React.useState<bookOpType>();
  const getBook = async () => {
    setLoading(true);
    await getBookList()
      .then((res) => {
        setMessage(res.data);
        console.log(res.data);
        enqueueSnackbar(t("api.success"), { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(t("api.error"), { variant: "error" });
        console.log(err);
      });
    setLoading(false);
  };

  React.useEffect(() => {
    if (status) {
      getBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  React.useEffect(() => {
    if (restart) {
      getBook();
      setRestart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    op: bookOpType
  ) => {
    event.preventDefault();
    if (selectedId === null) {
      enqueueSnackbar(t("management.book.notSelect"), { variant: "error" });
      return;
    }
    if (op === "viewPDF") {
      console.log(
        message.filter(
          (data) => data.id === (selectedId as unknown as number[])[0]
        )
      );
      const win = window.open(
        `/views?resource=${
          message.filter(
            (data) => data.id === (selectedId as unknown as number[])[0]
          )[0].mid
        }`,
        "_blank"
      );
      win?.focus();
    } else {
      setType(op);
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  return (
    <RequiredRole
      user={props.user}
      requireRole={[role.SUPERADMIN, role.ADMIN]}
      status={status}
      setStatus={setStatus}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "630",
          }}
        >
          <Title>{t("management.book.title")}</Title>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography color="text.secondary">
              {t("management.book.number")}
            </Typography>
            <Chip label={message.length} color={"info"} />
            <Divider orientation="vertical" flexItem />
            <Tooltip title={t("management.book.restart")}>
              <IconButton onClick={() => setRestart(true)}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Button
              variant="contained"
              color="info"
              onClick={(e) => {
                handleClick(e, "viewPDF");
              }}
            >
              {t("management.book.op.view")}
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={(e) => {
                handleClick(e, "viewFile");
              }}
            >
              {t("management.book.op.file")}
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button
              variant="contained"
              color="info"
              onClick={(e) => {
                handleClick(e, "editType");
              }}
            >
              {t("management.book.op.edit_type")}
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={(e) => {
                handleClick(e, "editKeyword");
              }}
            >
              {t("management.book.op.edit_keyword")}
            </Button>
          </Stack>
          <Divider light flexItem sx={{ margin: "8px" }} />
          <BookDataTable
            message={message}
            isLoading={isLoading}
            setMessage={setMessage}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </Paper>
        <PositionSwipeableDrawer
          position="bottom"
          open={open}
          setOpen={setOpen}
          setAnchorEl={setAnchorEl}
          // width={300}
        >
          <BookBar
            op={type}
            bookId={type ? (selectedId as unknown as number[])[0] : null}
            book={
              type
                ? message.filter(
                    (book) => book.id === (selectedId as unknown as number[])[0]
                  )[0]
                : null
            }
            setData={setMessage}
          />
        </PositionSwipeableDrawer>
      </Box>
    </RequiredRole>
  );
};

export default BookControl;
