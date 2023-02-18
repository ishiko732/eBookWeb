import request from "../config/request";

// 查询共享书信息
export const getShareBookByBookId = (id: number) => request.get(`share/${id}`);

export const getShareBookByFileId = (id: number) =>
  request.get(`share/file?fileId=${id}`);

export const getShareBooks = (uid?: number) =>
  request.get(uid ? `share/books?uid=${uid}` : "share/books");

// 添加共享书 updateBook更新图书信息
export const addShareBook = (fileId: number) =>
  request.post(`share/addShareBook?fileId=${fileId}`);

// 删除共享书
export const deleteShareBook = (bookId: number) =>
  request.delete(`share/${bookId}`);

// 审核共享书
export type Review = "WAIT" | "AGREE" | "REVOKE";
export const checkShareBook = (
  bookId: number,
  status: Review,
  comment: string
) =>
  request({
    method: "post",
    url: `share/${bookId}/check`,
    data: {
      status: status,
      comment: comment,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 点赞共享书
export const addLove = (bookId: number) => request.get(`share/${bookId}/love`);
// 添加共享书浏览量
export const browse = (bookId: number) => request.get(`share/${bookId}/browse`);

// 查询共享书的评论
export const getShareBookComments = (bookId: number) =>
  request.get(`share/${bookId}/comments`);

// 添加共享书的评论
export const addShareBookComment = (
  bookId: number,
  comment: string,
  parentId?: number | null
) =>
  request({
    method: "post",
    url: `share/${bookId}/comment`,
    data: parentId
      ? {
          message: comment,
          cid: parentId,
        }
      : {
          message: comment,
        },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 删除共享书的评论
export const deleteShareBookComment = (bookId: number, commentId: number) =>
  request.delete(`share/${bookId}/${commentId}`);
