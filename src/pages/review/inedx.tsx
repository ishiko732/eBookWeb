import { styled } from "@mui/material/styles";
import { Stack, Paper } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { State } from "../../algorithm/fsrs/models";
import { queryCards, queryParameter } from "../../api/fsrs";
import RequiredRole from "../../config/requiredRole";
import { useReadContext } from "../../ReadContext";
import { useUserContext } from "../../UserContext";
import ReviewConfig from "./config/ReviewConfig";

const ReviewHome = () => {
  const { cards, setCards, setParameter } = useReadContext();
  const [status, setStatus] = useState(false);
  const { user } = useUserContext();
  useEffect(() => {
    status &&
      queryParameter(user.id).then((res) => {
        setParameter(res.data);
      });
    status &&
      queryCards({
        uid: user.id,
      }).then((res) => {
        setCards(res.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user]);

  return (
    <RequiredRole user={user} status={status} setStatus={setStatus}>
      <Fragment>
        <ReviewConfig />
        <Stack direction="column" spacing={2}>
          {cards.length > 0 &&
            cards
              .filter((card) => (card.state as string) === State[State.New])
              .map((card) => <Item>{JSON.stringify(card)}</Item>)}
        </Stack>
      </Fragment>
    </RequiredRole>
  );
};

export default ReviewHome;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
