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
    data: vo.fileId
      ? {
          fileId: vo.fileId,
          data: vo.data || "",
        }
      : {
          topicId: vo.topicId,
          data: vo.data || "",
        },
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
  request({
    method: "get",
    url: `fsrs/topics`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const createNote = (vo: createNoteVo) =>
  request({
    method: "post",
    url: `fsrs/note`,
    data: {
      data: vo.data || "",
      uid: vo.uid,
      topicId: vo.topicId,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
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
  request({
    method: "get",
    url: `fsrs/notes`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });
