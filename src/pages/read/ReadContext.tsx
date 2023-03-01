import React from "react";
import { createContext, useContext } from "react";
import Vditor from "vditor";
import { book, topic } from "../../api/models";
export interface ProviderContext {
  book: book | null;
  setBook: React.Dispatch<React.SetStateAction<book | null>>;
  topic: topic | null;
  setTopic: React.Dispatch<React.SetStateAction<topic | null>>;
  vd: Vditor | undefined;
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>;
}

// @ts-ignore
export const ReadContext = createContext<ProviderContext>();

export function useReadContext() {
  return useContext(ReadContext);
}

export const ReadProvider = (props: { children: JSX.Element }) => {
  const [book, setBook] = React.useState<book | null>(null);
  const [selectText, setSelectText] = React.useState<string>("");
  const [topic, setTopic] = React.useState<topic | null>(null);
  const [vd, setVd] = React.useState<Vditor>();
  const value = {
    book,
    setBook,
    topic,
    setTopic,
    vd,
    setVd,
  };

  return (
    <ReadContext.Provider value={value}>{props.children}</ReadContext.Provider>
  );
};
