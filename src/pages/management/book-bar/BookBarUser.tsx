import { TFunction } from "i18next";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import React from "react";
import { file } from "../../../api/models";
import { getFileByResourceId } from "../../../api/file";
import { userById } from "../../../api/user";
import { Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { Loading } from "../../../components/Loading";

const BookBarUser = ({
  t,
  sourceId,
}: {
  t: TFunction<"translation", undefined, "translation">;
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  bookId: number | null;
  sourceId: string | null;
}) => {
  const [message, setMessage] = React.useState<any>(null);
  const getData = async (sourceId: string) => {
    getFileByResourceId(sourceId)
      .then((res) => {
        const files: file[] = res.data as file[];
        // eslint-disable-next-line array-callback-return
        const data: any = [];
        files.map(async (file) => {
          await userById(file.uid).then((res) => {
            data.push({ ...file, user: res.data });
            setMessage(data);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (sourceId) {
      getData(sourceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceId]);

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "630",
      }}
    >
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography>{t("management.media.fsId")}</Typography>
          <Chip label={sourceId} variant="outlined" />
          <Divider orientation="vertical" flexItem />
          <Typography>{t("management.book.user_number")}</Typography>
          <Chip
            label={message?.length || "N/A"}
            variant="outlined"
            color="info"
          />
        </Stack>
        {message ? (
          message.map((data: any) => {
            return (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Typography>{t("management.book.user_name")}</Typography>
                <Chip label={data.user.name} variant="outlined" />
                <Divider orientation="vertical" flexItem />
                <Typography>{t("management.media.fileName")}</Typography>
                <Chip label={data.filename} variant="outlined" />
              </Stack>
            );
          })
        ) : (
          <Loading />
        )}
      </Stack>
    </Paper>
  );
};

export default BookBarUser;
