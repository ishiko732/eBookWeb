import { Paper, Stack, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import { Fragment, useEffect, useRef, useState } from "react";
import seedrandom from "seedrandom";
import { Card, Rating, ReviewLog, SchedulingLog, State, fsrs } from "ts-fsrs";
import { deleteCardLog, queryCardLog, updateCard } from "../../api/fsrs";
import { card, cardVo, fsrsParameter, note, reviewLog } from "../../api/models";
import { noteFieldSplitCode } from "../../api/note";
import { useSwipeableDrawerContext } from "../../components/PositionSwipeableDrawer";
import { useReadContext } from "../../ReadContext";
import { useUserContext } from "../../UserContext";
import { fetchMockData } from "../../utils/sleep";
import ReviewLogContent from "./ReviewLogContent";
import FSRS from "ts-fsrs/lib/fsrs";

const LearningPage = (props: {
  newCard: card[];
  learningCard: card[];
  reviewCard: card[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCards: React.Dispatch<React.SetStateAction<card[]>>;
}) => {
  const { newCard, learningCard, reviewCard, setOpen, setCards } = props;
  const { parameter } = useReadContext();
  const [queueCard, setQueCard] = useState<card[]>([]);
  const [show, setShow] = useState(false);
  const [stack, setStack] = useState<
    {
      card: card;
      log: reviewLog;
    }[]
  >([]); // 撤回时需要移除waitCard的id
  const [done, setDone] = useState(false);
  const [currentCard, setcurrentCard] = useState<card>();
  const [waitCard, setWaitCard] = useState<string[]>([]);
  useEffect(() => {
    console.log(newCard, learningCard, reviewCard);
    const now_seed = dayjs().unix();
    const generator = seedrandom(String(now_seed));
    const queueCard: card[] = [];
    queueCard.push(...newCard);
    queueCard.push(...reviewCard);
    queueCard.sort(() => generator() - 0.5);
    //优先插入learing在前面
    queueCard.unshift(...learningCard);
    (async () => {
      const tempCard = queueCard.shift();
      await setcurrentCard(tempCard);
      await setDone(!tempCard);
      await setQueCard(queueCard);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOpen]);

  useEffect(() => {
    const repeal = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "z"
      ) {
        event.preventDefault();
        if (stack.length > 0) {
          const repeal_log = stack.pop();
          if (repeal_log && waitCard.indexOf(repeal_log.card.id) !== -1) {
            setWaitCard((pre) => pre.filter((id) => id !== repeal_log.card.id));
          }
          if (repeal_log && repeal_log.log.id) {
            deleteCardLog(repeal_log.log.id);
            done && setDone(false);
            currentCard &&
              setQueCard((pre) => {
                const newdata = [...pre];
                newdata.unshift(currentCard);
                return newdata;
              });
            setcurrentCard(repeal_log.card);
          }
        }
      } else if (" " === event.key.toLocaleLowerCase()) {
        event.preventDefault();
        !show && setShow(true);
        console.log(event.ctrlKey, event.metaKey, event.key);
      }
    };
    window.addEventListener("keydown", repeal);
    return () => {
      window.removeEventListener("keydown", repeal);
    };
  });

  const handleRecovery = (data: card) => {
    setWaitCard((pre) => {
      console.log(pre, data);
      const newdata = pre.filter((id) => id !== data.id);
      if (pre.length !== newdata.length) {
        setQueCard((pre) => {
          const newdata = [...pre];
          if (newdata.length === 0) {
            newdata.push(data);
            setcurrentCard(newdata.shift());
          } else {
            newdata.splice(0, 0, data);
          }
          console.log("滞后回复数据", data, newdata);
          return newdata;
        });
        setDone((preDone) => (preDone ? false : preDone));
        return newdata;
      }
      return pre;
    });
  };
  const handleRate = (card: Card, rating: Rating, log: ReviewLog) => {
    const _card = card as unknown as card;
    if (
      State[_card.state as "Learning" | "New" | "Review" | "Relearning"] !==
      State.Review
    ) {
      setWaitCard((pre) => {
        const newdata = [...pre];
        newdata.push(_card.id);
        return newdata;
      });
      fetchMockData(
        { ..._card },
        card.due.diff(card.last_review, "milliseconds")
      )
        .then((data: card) => {
          handleRecovery(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    updateCard({
      nid: _card.note.id,
      id: {
        id: _card.id,
        type: _card.type,
      },
      card: card as unknown as cardVo,
      log: {
        ...log,
        review: log.review.format(),
      },
    })
      .then((res) => {
        const _log: {
          card: card;
          log: reviewLog;
        } = res.data;
        setStack((pre) => {
          currentCard &&
            pre.push({
              card: { ...currentCard },
              log: { ..._log.log },
            });
          return pre;
        });
        setShow(false);
        if (queueCard.length === 0) {
          setcurrentCard(undefined);
          setDone(true);
        } else {
          setcurrentCard(queueCard.shift());
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return done ? (
    <DonePage />
  ) : (
    <Paper
      sx={{ width: "100%", height: "100%" }}
      elevation={3}
      variant="outlined"
    >
      <Stack
        direction="column"
        spacing={2}
        height={document.body.offsetHeight * 0.8}
        padding="16px"
        justifyContent="space-between"
        alignItems="center"
      >
        <QuestionPage note={currentCard ? currentCard.note : undefined} />
        {show && (
          <AnswerPage note={currentCard ? currentCard.note : undefined} />
        )}
        <ShowAnswer
          show={show}
          setShow={setShow}
          parameter={parameter}
          card={currentCard}
          handleRate={handleRate}
        />
      </Stack>
    </Paper>
  );
};

export default LearningPage;

const ShowAnswer = ({
  show,
  setShow,
  parameter,
  card,
  handleRate,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  parameter: fsrsParameter;
  card: card | undefined;
  handleRate: (card: Card, rating: Rating, log: ReviewLog) => void;
}) => {
  const { t } = useUserContext();
  const fsrsRef = useRef<FSRS>();
  const [schedulingLog, setSchedulingLog] = useState<SchedulingLog>();
  const { setOpen, setDrawerContent } = useSwipeableDrawerContext();
  useEffect(() => {
    fsrsRef.current = fsrs(parameter);
  }, [parameter]);
  useEffect(() => {
    if (!card || !show) {
      return;
    }
    if (!fsrsRef.current) {
      fsrsRef.current = new FSRS(parameter);
    }
    const _fsrs = fsrsRef.current as FSRS;
    const _log = _fsrs.repeat(
      {
        ...card,
        due: dayjs(card.due),
        last_review: card.last_review ? dayjs(card.last_review) : undefined,
        state:
          State[card.state as "Learning" | "New" | "Review" | "Relearning"],
      },
      dayjs()
    );
    setSchedulingLog(_log);
  }, [show, card, parameter]);
  useEffect(() => {
    const repeal = (event: KeyboardEvent) => {
      if (!schedulingLog) {
        return;
      }
      switch (event.key.toLocaleLowerCase()) {
        case "1":
          event.preventDefault();
          handleRate(
            schedulingLog[Rating.Again].card,
            Rating.Again,
            schedulingLog[Rating.Again].log
          );
          break;
        case "2":
          event.preventDefault();
          handleRate(
            schedulingLog[Rating.Hard].card,
            Rating.Hard,
            schedulingLog[Rating.Hard].log
          );
          break;
        case "3":
          event.preventDefault();
          handleRate(
            schedulingLog[Rating.Good].card,
            Rating.Good,
            schedulingLog[Rating.Good].log
          );
          break;
        case "4":
          event.preventDefault();
          handleRate(
            schedulingLog[Rating.Easy].card,
            Rating.Easy,
            schedulingLog[Rating.Easy].log
          );
          break;
        case "i":
          card &&
            queryCardLog({
              cid: card.id,
              type: card.type,
            })
              .then((res) => {
                setDrawerContent(
                  <ReviewLogContent logs={res.data as reviewLog[]} />
                );
                setOpen(true);
                console.log(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", repeal);
    return () => {
      window.removeEventListener("keydown", repeal);
    };
  });
  if (!card) {
    return null;
  }
  return schedulingLog && show ? (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <RatingButton
        card={schedulingLog[Rating.Again].card}
        rating={Rating.Again}
        log={schedulingLog[Rating.Again].log}
        handleRate={handleRate}
      />
      <RatingButton
        card={schedulingLog[Rating.Hard].card}
        rating={Rating.Hard}
        log={schedulingLog[Rating.Hard].log}
        handleRate={handleRate}
      />
      <RatingButton
        card={schedulingLog[Rating.Good].card}
        rating={Rating.Good}
        log={schedulingLog[Rating.Good].log}
        handleRate={handleRate}
      />
      <RatingButton
        card={schedulingLog[Rating.Easy].card}
        rating={Rating.Easy}
        log={schedulingLog[Rating.Easy].log}
        handleRate={handleRate}
      />
    </Stack>
  ) : (
    <Button
      fullWidth
      onClick={() => {
        setShow(true);
      }}
    >
      {t("card.show")}
    </Button>
  );
};

const RatingButton = ({
  card,
  rating,
  log,
  handleRate,
}: {
  card: Card;
  rating: Rating;
  log: ReviewLog;
  handleRate: (card: Card, rating: Rating, log: ReviewLog) => void;
}) => {
  const { t } = useUserContext();
  const diff =
    dayjs(card.due).diff(card.last_review, "day") > 0
      ? dayjs(card.due).diff(card.last_review, "day") + t("card.day")
      : dayjs(card.due).diff(card.last_review, "m") + t("card.min");
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <Typography>{diff}</Typography>
      <Button
        color={(t(`card.Rating_color.${Rating[rating]}`) as any) || undefined}
        variant="contained"
        onClick={() => {
          handleRate(card, rating, log);
        }}
      >
        {t(`card.Rating.${Rating[rating]}`)}
      </Button>
    </Stack>
  );
};
const QuestionPage = ({ note }: { note: note | undefined }) => {
  return note ? (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        {note.sfld}
      </Typography>
    </Fragment>
  ) : null;
};

const AnswerPage = ({ note }: { note: note | undefined }) => {
  const { t } = useUserContext();
  if (!note) {
    return null;
  }
  const fields = note.flds.split(noteFieldSplitCode);
  //   const commnet = note && note?.data !== "" ? JSON.parse(note.data) : null;
  const answer =
    fields && fields.length > 1 ? fields[1] : t("card.answer_is_empty");
  return (
    <Typography variant="body1" gutterBottom>
      {answer}
    </Typography>
  );
};

const DonePage = () => {
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
        padding="16px"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>{t("card.done")}</div>
      </Stack>
    </Paper>
  );
};
