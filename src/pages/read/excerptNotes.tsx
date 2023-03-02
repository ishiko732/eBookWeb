import { Stack } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { file, topic } from "../../api/models";
import AccordionItems, { AccordionItem } from "../../components/AccordionItems";
import { Notes } from "./Notes";
import { useReadContext } from "./ReadContext";
import Topic, { TopicTitle } from "./Topic";

const ExcerptNotes = (props: { file?: file | null; topic?: topic | null }) => {
  const { file } = props;
  const topicItem:AccordionItem = {
      title: <TopicTitle />,
      details: <Topic file={file} />,
      defaultExpanded: true,
  };
  const notesItem={
    title:"notes",
    details: <Notes/>,
    defaultExpanded: true,
  }
  const [items]=useState<AccordionItem[]>([topicItem,notesItem]);

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
