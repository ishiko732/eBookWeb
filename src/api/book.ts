import request from "../config/request";
import { selectVo } from "./models";
import { book } from "./models/index";

// 查询文件信息通过资源Id
export const getFileByResourceId = (fsId: string) =>
  request.get(`file/resource/${fsId}`);

// 查询图书信息通过资源Id
export const getBookByResourceId = (fsId: string) =>
  request.get(`book/${fsId}?isResource=1`);
// 查询图书信息通过图书Id
export const getBook = (id: number) => request.get(`book/${id}`);

// 查询所有的图书
export const getBookList = (option?: selectVo) =>
  request.get(
    option ? `book/books?page=${option.page}&size=${option.size}` : `book/books`
  );

// 更新图书信息
export const updateBook = (book: book) =>
  request({
    method: "put",
    url: `book/${book.id}`,
    data: {
      author: book.author,
      title: book.title,
      subject: book.subject,
      creator: book.creator,
      creationDate: book.creationDate,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 添加图书的类型
export const addBookTypeById = (bookId: number, types: string[]) =>
  request({
    method: "post",
    url: `book/book-type/${bookId}`,
    data: {
      types: types,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 删除图书的类型
export const deleteBookTypeById = (bookId: number, types: string[]) =>
  request({
    method: "delete",
    url: `book/book-type/${bookId}`,
    data: {
      types: types,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 更新图书的类型和关键词
export const updateBookTypeAndKeywordById = (
  bookId: number,
  addTypes: string[],
  deleteTypes: string[],
  addKeywords: string[],
  deleteKeywords: string[]
) =>
  request({
    method: "put",
    url: `book/keyword-type/${bookId}`,
    data: {
      addTypes: addTypes,
      deleteTypes: deleteTypes,
      addKeywords: addKeywords,
      deleteKeywords: deleteKeywords,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 添加单个类型
export const addType = (type: string) => request.post(`book/type/${type}`);
// 查询单个类型
export const getType = (type: string) => request.get(`book/type/${type}`);
// 更新单个类型
export const updateType = (type: string, newType: string) =>
  request.put(`book/type/${type}?new_type=${newType}`);
// 删除单个类型
export const deleteType = (type: string) => request.delete(`book/type/${type}`);
// 查询所有的类型
export const getBookTypes = (option?: selectVo) =>
  request.get(
    option ? `book/types?page=${option.page}&size=${option.size}` : `book/types`
  );

// 添加图书的关键词
export const addBookKeyWordById = (bookId: number, keywords: string[]) =>
  request({
    method: "post",
    url: `book/book-keyword/${bookId}`,
    data: {
      keywords: keywords,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 删除图书的关键词
export const deleteBookKeyWordById = (bookId: number, keywords: string[]) =>
  request({
    method: "delete",
    url: `book/book-keyword/${bookId}`,
    data: {
      keywords: keywords,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 添加单个关键词
export const addKeyword = (keyword: string) =>
  request.post(`book/keyword/${keyword}`);
// 查询单个关键词
export const getKeyword = (keyword: string) =>
  request.get(`book/keyword/${keyword}`);
// 更新单个关键词
export const updateKeyword = (keyword: string, newKeyWord: string) =>
  request.put(`book/keyword/${keyword}?new_keyWord=${newKeyWord}`);
// 删除单个关键词
export const deleteKeyword = (keyword: string) =>
  request.delete(`book/keyword/${keyword}`);
// 查询所有的关键词
export const getBookKeyWords = (option?: selectVo) =>
  request.get(
    option
      ? `book/keywords?page=${option.page}&size=${option.size}`
      : `book/keywords`
  );
