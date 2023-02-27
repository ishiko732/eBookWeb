import { Stack } from "@mui/material";
import React from "react";
import { file } from "../../api/models";
import AccordionItems from "../../components/AccordionItems";
import { SelectTextContent } from "./SelectTextContent";
import VditorEdit from "./VditorEdit";

const ExcerptNotes = (props: {
  file?: file | null;
  textRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const { file, textRef } = props;
  const selectTextJSX = (
    <SelectTextContent
      textRef={textRef}
      style={{ minHeight: document.body.offsetHeight * 0.05 }}
    />
  );
  const Vditor = file ? (
    <VditorEdit
      style={{
        minHeight: document.body.offsetHeight * 0.2,
        maxHeight: document.body.offsetHeight * 0.5,
      }}
    />
  ) : (
    <React.Fragment></React.Fragment>
  );
  const items = [
    {
      title: "SelectTexts",
      details: selectTextJSX,
      defaultExpanded: false,
    },
    {
      title: "Topic",
      details: Vditor,
      defaultExpanded: false,
    },
  ];

  return (
    <Stack
      direction="column"
      // divider={<Divider  flexItem />}
      spacing={2}
    >
      <AccordionItems items={items} />
    </Stack>
  );
};

export default ExcerptNotes;
