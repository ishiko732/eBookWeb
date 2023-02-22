import React from "react";
import { createContext, useContext } from "react";
import { book } from "../../api/models";
import { TreeData } from "../../components/tree-view/CustomTreeView";
export interface ProviderContext {
  book: book | null;
  setBook: React.Dispatch<React.SetStateAction<book | null>>;
  selectedFilesNode: TreeData[] | null;
  setSelectFilesNode: React.Dispatch<React.SetStateAction<TreeData[] | null>>;
}

// @ts-ignore
export const ReadContext = createContext<ProviderContext>();

export function useReadContext() {
  return useContext(ReadContext);
}

export const ReadProvider = (props: { children: JSX.Element }) => {
  const [book, setBook] = React.useState<book | null>(null);
  const [selectedNode, setSelectNode] = React.useState<TreeData[] | null>(null);
  const value = {
    book,
    setBook,
    selectedFilesNode: selectedNode,
    setSelectFilesNode: setSelectNode,
  };
  return (
    <ReadContext.Provider value={value}>{props.children}</ReadContext.Provider>
  );
};
