import React from "react";
import { createContext, useContext } from "react";
import Vditor from "vditor";
import { generatorParameters } from "./algorithm/fsrs/models";
import { book, card, fsrsParameter, note, topic } from "./api/models";
export interface ProviderContext {
  book: book | null;
  setBook: React.Dispatch<React.SetStateAction<book | null>>;
  topics: topic[];
  setTopics: React.Dispatch<React.SetStateAction<topic[]>>;
  topicIndex: number;
  setTopicIndex: React.Dispatch<React.SetStateAction<number>>;
  vd: Vditor | undefined;
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>;
  notes: note[];
  setNotes: React.Dispatch<React.SetStateAction<note[]>>;
  cards: card[];
  setCards: React.Dispatch<React.SetStateAction<card[]>>;
  parameter: fsrsParameter;
  setParameter: React.Dispatch<React.SetStateAction<fsrsParameter>>;
}

// @ts-ignore
export const ReadContext = createContext<ProviderContext>();

export function useReadContext() {
  return useContext(ReadContext);
}

export const ReadProvider = (props: { children: JSX.Element }) => {
  const [book, setBook] = React.useState<book | null>(null);
  const [topics, setTopics] = React.useState<topic[]>([]);
  const [topicIndex, setTopicIndex] = React.useState(0);
  const [vd, setVd] = React.useState<Vditor>();
  const [notes, setNotes] = React.useState<note[]>([]);
  const [cards, setCards] = React.useState<card[]>([]);
  const [parameter, setParameter] = React.useState<fsrsParameter>({
    ...generatorParameters(),
    uid: 0,
    createdAt: 0,
    updateAt: 0,
  });

  const value = {
    book,
    setBook,
    topics,
    setTopics,
    topicIndex,
    setTopicIndex,
    vd,
    setVd,
    notes,
    setNotes,
    cards,
    setCards,
    parameter,
    setParameter,
  };

  return (
    <ReadContext.Provider value={value}>{props.children}</ReadContext.Provider>
  );
};
