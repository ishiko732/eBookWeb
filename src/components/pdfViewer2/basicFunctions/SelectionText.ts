import React from "react";

export const selectionchange = (event: Event) => {
  //https://stackoverflow.com/questions/48950038/how-do-i-retrieve-text-from-user-selection-in-pdf-js
  const text = window
    .getSelection()
    ?.toString()
    .replace(/\r\n/g, "")
    .replace(/\n/g, "");
  return text && text !== "" ? text : null;
};

export const SelectionText = (
  PDFViewerRef: React.RefObject<HTMLDivElement>,
  handleText: (event: Event) => void
) => {
  if (!PDFViewerRef.current) {
    return;
  }
  const _target = PDFViewerRef.current;
  _target.addEventListener("mouseup", handleText);
  return () => {
    _target.removeEventListener("mouseup", handleText);
  };
};
