import dayjs from "dayjs";
import {
  Card,
  FSRSParameters,
  Rating,
  ReviewLog,
  createEmptyCard,
} from "ts-fsrs";
import FSRS from "ts-fsrs/lib/fsrs";

export interface example {
  card: Card;
  log: ReviewLog;
}

export const generatorExample1 = (fsrsParameter: FSRSParameters): example[] => {
  // new -> again -> hard->good->easy->easy->again->good->hard
  const fsrs = new FSRS(fsrsParameter);
  const newCard = createEmptyCard();
  let card = newCard;
  let now = dayjs();
  let scheduling_cards = fsrs.repeat(card, now);
  const again = scheduling_cards[Rating.Again];

  card = again.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard = scheduling_cards[Rating.Hard];

  card = hard.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good = scheduling_cards[Rating.Good];

  card = good.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const easy1 = scheduling_cards[Rating.Easy];

  card = easy1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const easy2 = scheduling_cards[Rating.Easy];

  card = easy2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const again2 = scheduling_cards[Rating.Again];

  card = again2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good2 = scheduling_cards[Rating.Good];

  card = good2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard2 = scheduling_cards[Rating.Hard];

  const data = [again, hard, good, easy1, easy2, again2, good2, hard2];
  return data;
};

export const generatorExample2 = (fsrsParameter: FSRSParameters): example[] => {
  // new -> hard -> good->again->easy->easy->good->hard->hard
  const fsrs = new FSRS(fsrsParameter);
  const newCard = createEmptyCard();
  let card = newCard;
  let now = dayjs();
  let scheduling_cards = fsrs.repeat(card, now);
  const hard1 = scheduling_cards[Rating.Hard];

  card = hard1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good1 = scheduling_cards[Rating.Good];

  card = good1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const again = scheduling_cards[Rating.Again];

  card = again.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const easy1 = scheduling_cards[Rating.Easy];

  card = easy1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const easy2 = scheduling_cards[Rating.Easy];

  card = easy2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good2 = scheduling_cards[Rating.Good];

  card = good2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard2 = scheduling_cards[Rating.Hard];

  card = hard2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard3 = scheduling_cards[Rating.Hard];

  const data = [hard1, good1, again, easy1, easy2, good2, hard2, hard3];
  return data;
};

export const generatorExample3 = (fsrsParameter: FSRSParameters): example[] => {
  // new -> good -> good->again->easy->hard->good->again->good
  const fsrs = new FSRS(fsrsParameter);
  const newCard = createEmptyCard();
  let card = newCard;
  let now = dayjs();
  let scheduling_cards = fsrs.repeat(card, now);
  const good1 = scheduling_cards[Rating.Good];

  card = good1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good2 = scheduling_cards[Rating.Good];

  card = good2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const again1 = scheduling_cards[Rating.Again];

  card = again1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const easy1 = scheduling_cards[Rating.Easy];

  card = easy1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard = scheduling_cards[Rating.Hard];

  card = hard.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good3 = scheduling_cards[Rating.Good];

  card = good3.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const again2 = scheduling_cards[Rating.Again];

  card = again2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good4 = scheduling_cards[Rating.Good];

  const data = [good1, good2, again1, easy1, hard, good3, again2, good4];
  return data;
};

export const generatorExample4 = (fsrsParameter: FSRSParameters): example[] => {
  // new -> easy -> good->again->easy->hard->good->hard->good
  const fsrs = new FSRS(fsrsParameter);
  const newCard = createEmptyCard();
  let card = newCard;
  let now = dayjs();
  let scheduling_cards = fsrs.repeat(card, now);
  const easy1 = scheduling_cards[Rating.Easy];

  card = easy1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good1 = scheduling_cards[Rating.Good];

  card = good1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const again1 = scheduling_cards[Rating.Again];

  card = again1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const easy2 = scheduling_cards[Rating.Easy];

  card = easy2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard1 = scheduling_cards[Rating.Hard];

  card = hard1.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good2 = scheduling_cards[Rating.Good];

  card = good2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const hard2 = scheduling_cards[Rating.Hard];

  card = hard2.card;
  now = card.due;
  scheduling_cards = fsrs.repeat(card, now);
  const good3 = scheduling_cards[Rating.Good];

  const data = [easy1, good1, again1, easy2, hard2, good2, hard2, good3];
  return data;
};
