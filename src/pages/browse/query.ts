import { shareBook } from "../../api/models";

export const queryBook = (books: shareBook[], query: string) => {
  const query_split = query.split(";");
  const filterBook = new Set<shareBook>();
  query_split.forEach((query) => {
    if (query.toLowerCase() === "max(love)") {
      books
        .filter(
          (shareBook) =>
            shareBook.love === Math.max(...books.map((book) => book.love))
        )
        .forEach((item) => filterBook.add(item));
    } else if (query.toLowerCase() === "min(love)") {
      books
        .filter(
          (shareBook) =>
            shareBook.love === Math.min(...books.map((book) => book.love))
        )
        .forEach((item) => filterBook.add(item));
    } else {
      books
        .filter((shareBook) => {
          return (
            shareBook.book.author?.indexOf(query) !== -1 ||
            shareBook.book.title?.indexOf(query) !== -1 ||
            shareBook.book.subject?.indexOf(query) !== -1 ||
            shareBook.book.title?.indexOf(query) !== -1 ||
            shareBook.book.author?.indexOf(query) !== -1 ||
            shareBook.book.keywords
              .map((key) => key.keyword)
              ?.indexOf(query) !== -1 ||
            shareBook.book.types.map((key) => key.type)?.indexOf(query) !== -1
          );
        })
        .forEach((item) => filterBook.add(item));
    }
  });
  return Array.from(filterBook);
};
