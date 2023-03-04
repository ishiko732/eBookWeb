import { Paper, Stack, Typography, Chip, Button } from "@mui/material";
import { card } from "../../api/models";
import Title from "../../components/Title";
import { useUserContext } from "../../UserContext";

const ViewCardMessagePage = (props: {
  newCard: card[];
  learingCard: card[];
  reviewCard: card[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { newCard, learingCard, reviewCard, setOpen } = props;
  const { t } = useUserContext();

  return (
    <Paper
      sx={{ width: "100%", height: "100%" }}
      elevation={3}
      variant="outlined"
    >
      <Stack
        direction="column"
        spacing={2}
        height={document.body.offsetHeight * 0.8}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Title>{t("card.title")}</Title>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={16}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography>{`${t("card.new")}`}</Typography>
              <Chip color="info" label={newCard.length} />
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography>{`${t("card.learing")}`}</Typography>
              <Chip color="error" label={learingCard.length} />
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography>{`${t("card.review")}`}</Typography>
              <Chip color="success" label={reviewCard.length} />
            </Stack>
          </Stack>
          <Stack>
            <Button variant="contained" onClick={() => setOpen(true)}>{`${t(
              "card.start"
            )}`}</Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ViewCardMessagePage;
