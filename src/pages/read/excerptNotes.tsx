import { Stack } from "@mui/material";
import { file } from "../../api/models";
import { SelectTextContent } from "./SelectTextContent";
import VditorEdit from "./VditorEdit";

const ExcerptNotes = (props: {
  file?: file | null;
  textRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const { file, textRef } = props;

  return (
    <Stack
      direction="column"
      // divider={<Divider  flexItem />}
      spacing={2}
    >
      <SelectTextContent
        textRef={textRef}
        style={{ minHeight: document.body.offsetHeight * 0.05 }}
      />

      {file ? (
        <VditorEdit
          style={{
            minHeight: document.body.offsetHeight * 0.2,
            maxHeight: document.body.offsetHeight * 0.5,
          }}
        />
      ) : null}
    </Stack>
  );
};

export default ExcerptNotes;
