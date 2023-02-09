import {
  Box,
  Paper,
  Stack,
  Button,
  Divider,
  Typography,
  Chip,
  IconButton,
  Tooltip,
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

const BookControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState<book[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [restart, setRestart] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const getBook = async () => {
    setLoading(true);
    await getBookList()
      .then((res) => {
        setMessage(res.data);
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

  React.useEffect(() => {
    console.log(selectedId);
  }, [selectedId]);
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
              // onClick={(e) => {
              //   ClickOp(e, params.row, "file");
              // }}
            >
              {t("management.book.op.file")}
            </Button>
            <Button
              variant="contained"
              color="info"
              // onClick={(e) => {
              //   ClickOp(e, params.row, "comment");
              // }}
            >
              {t("management.book.op.comment")}
            </Button>
            <Button
              variant="contained"
              color="info"
              // onClick={(e) => {
              //   ClickOp(e, params.row, "share");
              // }}
            >
              {t("management.book.op.share")}
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
      </Box>
    </RequiredRole>
  );
};

export default BookControl;
