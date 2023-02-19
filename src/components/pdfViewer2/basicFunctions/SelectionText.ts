import React from "react";

export const selectionchange = (event: Event) => {
  //https://stackoverflow.com/questions/48950038/how-do-i-retrieve-text-from-user-selection-in-pdf-js
  const text = window
    .getSelection()
    ?.toString()
    .replace(/\r\n/g, "")
    .replace(/\n/g, "");
  text !== "" && console.log(text);
};

export const SelectionText = (
  PDFViewerRef: React.RefObject<HTMLDivElement>
) => {
  if (!PDFViewerRef.current) {
    return;
  }
  const _target = PDFViewerRef.current;
  _target.addEventListener("mouseup", selectionchange);
  return () => {
    _target.removeEventListener("mouseup", selectionchange);
  };
};
