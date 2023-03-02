import { createCard as createCardEntity } from "../algorithm/fsrs/fsrs";
import { createCard as createCardAPI } from "./fsrs";
import request from "../config/request";
import {
  createNoteVo,
  createTopicVo,
  note,
  queryNotesVo,
  queryTopicsVo,
  topic,
} from "./models";

export const createTopic = (vo: createTopicVo) =>
  request({
    method: "post",
    url: `fsrs/topic`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const queryTopic = (tid: string) => request.get(`fsrs/topic?tid=${tid}`);

export const updateTopic = (vo: topic) =>
  request({
    method: "put",
    url: `fsrs/topic`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const deleteTopic = (tid: string) =>
  request.delete(`fsrs/topic?tid=${tid}`);

export const queryTopics = (vo: queryTopicsVo) =>
  request.get(`fsrs/topics`, { params: vo });

export const createNote = (vo: createNoteVo) =>
  request({
    method: "post",
    url: `fsrs/note`,
    data: {
      ...vo,
      data: vo.data || "",
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  }).then((res) => {
    const note: note = res.data;
    const entity = createCardEntity();
    const cardVo = {
      ...entity,
      due: entity.due.format(),
      last_review: undefined,
    };
    createCardAPI({
      nid: note.id,
      type: 0,
      card: cardVo,
    });
    return res;
  });

export const queryNote = (noteId: string) =>
  request.get(`fsrs/note?noteId=${noteId}`);

export const updateNote = (vo: note) =>
  request({
    method: "put",
    url: `fsrs/note`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const deleteNote = (noteId: string) =>
  request.delete(`fsrs/note?noteId=${noteId}`);

export const queryNotes = (vo: queryNotesVo) =>
  request.get(`fsrs/notes`, { params: vo });
