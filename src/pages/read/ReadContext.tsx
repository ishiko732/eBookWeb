import React from "react";
import { createContext, useContext } from "react";
import { book } from "../../api/models";
export interface ProviderContext {
  book: book | null;
  setBook: React.Dispatch<React.SetStateAction<book | null>>;
  selectText: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
}

// @ts-ignore
export const ReadContext = createContext<ProviderContext>();

export function useReadContext() {
  return useContext(ReadContext);
}

export const ReadProvider = (props: { children: JSX.Element }) => {
  const [book, setBook] = React.useState<book | null>(null);
  const [selectText, setSelectText] = React.useState<string>("");
  const value = {
    book,
    setBook,
    selectText,
    setSelectText,
  };
  return (
    <ReadContext.Provider value={value}>{props.children}</ReadContext.Provider>
  );
};
