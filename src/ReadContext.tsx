import React from "react";
import { createContext, useContext } from "react";
import Vditor from "vditor";
import { book, note, topic } from "./api/models";
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
  };

  return (
    <ReadContext.Provider value={value}>{props.children}</ReadContext.Provider>
  );
};
