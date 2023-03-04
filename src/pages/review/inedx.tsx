import { styled } from "@mui/material/styles";
import { Stack, Paper } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { State } from "../../algorithm/fsrs/models";
import { queryCards, queryParameter } from "../../api/fsrs";
import RequiredRole from "../../config/requiredRole";
import { useReadContext } from "../../ReadContext";
import { useUserContext } from "../../UserContext";
import ReviewConfig from "./config/ReviewConfig";
import { card } from "../../api/models";
import dayjs from "dayjs";

const ReviewHome = () => {
  const { cards, setCards, setParameter } = useReadContext();
  const { t } = useUserContext();

  const [status, setStatus] = useState(false);
  const [newCard, setNewCard] = useState<card[]>([]);
  const [learingCard, setLearingCard] = useState<card[]>([]);
  const [reviewCard, setReviewCard] = useState<card[]>([]);

  const { user } = useUserContext();
  useEffect(() => {
    const now = dayjs();
    status &&
      queryParameter(user.id).then((res) => {
        setParameter(res.data);
      });
    status &&
      queryCards({
        uid: user.id,
      }).then((res) => {
        const _cards = res.data as card[];
        const _new: card[] = [];
        const _learing: card[] = [];
        const _review: card[] = [];
        setCards(_cards);
        // debugger
        _cards.forEach((card) => {
          switch (card.state as string) {
            case State[State.New]:
              _new.push(card);
              break;
            case State[State.Relearning]:
            case State[State.Learning]:
              _learing.push(card);
              break;
            case State[State.Review]:
              now.diff(dayjs(card.due)) > 0 && _review.push(card);
              break;
            default:
              break;
          }
          setNewCard(_new.sort((a, b) => Number(a.due) - Number(b.due)));
          setLearingCard(
            _learing.sort((a, b) => Number(a.due) - Number(b.due))
          );
          setReviewCard(_review.sort((a, b) => Number(a.due) - Number(b.due)));
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user]);

  return (
    <RequiredRole user={user} status={status} setStatus={setStatus}>
      <Fragment>
        <ReviewConfig />
        <Stack direction="column" spacing={2}>
          <Item>{`${t("card.new")}:${newCard.length}-${JSON.stringify(
            newCard
          )}`}</Item>
          <Item>{`${t("card.learing")}:${learingCard.length}`}</Item>
          <Item>{`${t("card.review")}:${reviewCard.length}`}</Item>
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
