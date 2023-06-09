import { Stack } from "@mui/material";
import { useState } from "react";
import { file, topic } from "../../api/models";
import AccordionItems, { AccordionItem } from "../../components/AccordionItems";
import { Notes } from "./Notes";
import Topic, { TopicTitle } from "./Topic";
import { useUserContext } from "../../UserContext";

const ExcerptNotes = (props: { file?: file | null; topic?: topic | null }) => {
  const { file } = props;
  const { t } = useUserContext();
  const topicItem: AccordionItem = {
    title: <TopicTitle />,
    details: <Topic file={file} />,
    defaultExpanded: true,
  };
  const notesItem = {
    title: t("read.notes"),
    details: <Notes />,
    defaultExpanded: true,
  };
  const [items] = useState<AccordionItem[]>([topicItem, notesItem]);

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
