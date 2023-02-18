import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useSnackbar,
} from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import { role } from "../../api/entity/auth";
import {
  reviewStatus,
  reviewStatusType,
  shareBook,
} from "../../api/models";
import Title from "../../components/Title";
import RequiredRole from "../../config/requiredRole";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PositionSwipeableDrawer from "../../components/PositionSwipeableDrawer";
import { getShareBooks } from "../../api/share";
import ShareDataTable from "./ShareDataTable";
import { bookOpType } from "./book-bar/inex";
import ShareBookBar from "./book-bar/ShareBookBar";

const ShareControl = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [message, setMessage] = React.useState<shareBook[]>([]);
  const [status, setStatus] = React.useState(false);
  const [restart, setRestart] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [type, setType] = React.useState<bookOpType>();
  const [opNode, setOpNode] = React.useState<shareBook | null>(null);
  const getBook = async () => {
    setLoading(true);
    await getShareBooks()
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

  const ClickOp = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: shareBook,
    op: bookOpType
  ) => {
    event.stopPropagation();
    console.log(op);
    switch (op) {
      case "viewReview":
      case "viewBook":
      case "viewBookFile":
        setOpNode(row);
        setType(op);
        setAnchorEl(event.currentTarget);
        setOpen(true);
        break;
      default:
        break;
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
          <Title>{t("management.review.title")}</Title>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {reviewStatus.map((status: reviewStatusType) => {
              return (
                <React.Fragment>
                  <Typography color="text.secondary">
                    {t(`management.review.status.${status}`)}
                  </Typography>
                  <Chip
                    label={
                      message.filter(
                        (sharebook) => sharebook.review.status === status
                      ).length
                    }
                    color={
                      (t(`management.review.color.${status}`) as any) || "info"
                    }
                  />
                </React.Fragment>
              );
            })}
            <Divider orientation="vertical" flexItem />
            <Tooltip title={t("management.book.restart")}>
              <IconButton onClick={() => setRestart(true)}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
          </Stack>
          <Divider light flexItem sx={{ margin: "8px" }} />
          <ShareDataTable
            message={message}
            isLoading={isLoading}
            setMessage={setMessage}
            ClickOp={ClickOp}
          />
        </Paper>
        <PositionSwipeableDrawer
          position="bottom"
          open={open}
          setOpen={setOpen}
          setAnchorEl={setAnchorEl}
        >
          <ShareBookBar
            shareBook={type ? opNode : null}
            setData={setMessage}
            op={type}
          />
        </PositionSwipeableDrawer>
      </Box>
    </RequiredRole>
  );
};

export default ShareControl;
