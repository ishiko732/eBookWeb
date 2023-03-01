import { Stack } from "@mui/material";
import { file, topic } from "../../api/models";
import AccordionItems from "../../components/AccordionItems";
import Topic, { TopicTitle } from "./Topic";

const ExcerptNotes = (props: { file?: file | null; topic?: topic | null }) => {
  const { file } = props;
  const topicJSX = <Topic file={file} />;
  const items = [
    {
      title: <TopicTitle />,
      details: topicJSX,
      defaultExpanded: true,
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
