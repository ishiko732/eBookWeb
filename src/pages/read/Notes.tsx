import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { note } from "../../api/models";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useReadContext } from "./ReadContext";
import { Fragment, useEffect, useState } from "react";
import { createNote, deleteNote, queryNotes, updateNote } from "../../api/note";
import { useSwipeableDrawerContext } from "../../components/PositionSwipeableDrawer";
import VditorNoteEdit from "./VditorNoteEdit";
import Vditor from "vditor";
import { t } from "i18next";
import { MuiChipsInput, MuiChipsInputChip } from "mui-chips-input";
import { LoadingButton } from "@mui/lab";
import Title from "../../components/Title";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUserContext } from "../../UserContext";
export const Notes = () => {
  const [items, setItems] = useState<note[]>([]);
  const { notes, topics, setNotes, topicIndex } = useReadContext();
  const { setPostion } = useSwipeableDrawerContext();
  setPostion("bottom");
  useEffect(() => {
    setItems(notes);
  }, [notes]);

  useEffect(() => {
    topics.length > topicIndex &&
      queryNotes({
        topicId: topics[topicIndex].id,
      })
        .then((res) => {
          setNotes(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicIndex, topics]);
  return (
    <div id="notes">
      <List dense>
        {items.length > 0 &&
          items.map((note, index) => (
            <Note note={note} key={`note-${index}`} />
          ))}
      </List>
    </div>
  );
};

const Note = ({ note }: { note: note }) => {
  const commnet = note.data !== "" ? JSON.parse(note.data) : null;
  const { setOpen, setDrawerContent } = useSwipeableDrawerContext();
  const { topics, topicIndex } = useReadContext();
  const topicId = topics.length > topicIndex && topics[topicIndex].id;

  return (
    <Fragment>
      <ListItem
        key={note.id}
        secondaryAction={
          !(commnet && commnet.id) && (
            <IconButton
              edge="start"
              onClick={() => deleteNote(note.id)}
              color="primary"
            >
              <DeleteIcon />
            </IconButton>
          )
        }
        disablePadding
      >
        <ListItemButton
          onClick={(event) => {
            setDrawerContent(<NoteEdit note={note} topicId={topicId} />);
            setOpen(true);
          }}
        >
          <ListItemText
            primary={
              commnet
                ? `${commnet["text"]} ${note.sfld}` || note.sfld
                : note.sfld
            }
            //   secondary={note.sfld}
          />
        </ListItemButton>
      </ListItem>
      <Divider component="li" />
    </Fragment>
  );
};

const NoteEdit = ({
  note,
  topicId,
}: {
  note?: note;
  topicId: string | false;
}) => {
  const isUpdate = Boolean(note);
  const [isLoading, setLoading] = useState(false);
  const [questionVd, setQuestionVd] = useState<Vditor>();
  const [answerVd, setAnswerVd] = useState<Vditor>();
  const commnet = isUpdate
    ? note && note?.data !== ""
      ? JSON.parse(note.data)
      : null
    : null;
  const [tags, setTags] = useState<string[]>(note?.tags?.split(";") || []);
  const { setOpen } = useSwipeableDrawerContext();
  const { t, user } = useUserContext();

  const handleChange = (newValue: MuiChipsInputChip[]) => {
    const setData: Set<string> = new Set();
    newValue.forEach((value) => setData.add(value));
    setTags(Array.from(setData));
  };
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      {JSON.stringify(note)}
      <Title>{t("note.title")}</Title>
      <Stack
        direction="row"
        spacing={1}
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1" gutterBottom>
          {t("note.question")}
        </Typography>
        <VditorNoteEdit id={"question"} vd={questionVd} setVd={setQuestionVd} />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1" gutterBottom>
          {t("note.answer")}
        </Typography>
        <VditorNoteEdit id={"answer"} vd={answerVd} setVd={setAnswerVd} />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1" gutterBottom>
          {t("note.label")}
        </Typography>

        <MuiChipsInput
          value={tags}
          onChange={(value) => handleChange(value)}
          disableEdition
          hideClearAll
          placeholder={t("management.book.edit_text") as string}
          // variant="standard"
          sx={{
            width: "70%",
          }}
        />
      </Stack>
      <Divider sx={{ width: "80%", padding: "8px" }} />
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        width={"80%"}
        spacing={2}
        padding="16px"
      >
        <LoadingButton
          // loading
          loadingPosition="end"
          endIcon={<CancelIcon />}
          variant="outlined"
          onClick={() => {
            setOpen(false);
          }}
        >
          {t("note.cancel")}
        </LoadingButton>
        <LoadingButton
          // loading
          loadingPosition="end"
          endIcon={<SaveIcon />}
          variant="outlined"
          onClick={() => {
            console.log(questionVd?.getValue());
            console.log(answerVd?.getValue());
            console.log(tags);
            setLoading(true);
            const data = `${questionVd?.getValue()}${String.fromCharCode(
              0x31
            )}${answerVd?.getValue()}`;
            if (isUpdate) {
              //@ts-ignore
              updateNote({
                id: note!.id,
                sfld: data,
                tags: tags.join(","),
                tid: note!.tid,
              })
                .then((res) => {
                  setLoading(false);
                })
                .catch((err) => {
                  console.log(err);
                  setLoading(false);
                });
            } else {
              typeof topicId === "string" &&
                //@ts-ignore
                createNote({
                  topicId: topicId,
                  uid: user.id,
                  data: data,
                })
                  .then((res) => {
                    setLoading(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setLoading(false);
                  });
            }
          }}
        >
          {t("note.save")}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};
