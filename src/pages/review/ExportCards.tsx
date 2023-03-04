import { note, User } from "../../api/models";
import { noteFieldSplitCode, queryNotes } from "../../api/note";

const useExportCards = (user: User) => {
  return queryNotes({
    uid: user.id,
  }).then((res) => {
    // create file link in browser's memory
    let download: string[][] = [["question", "answer", "comment"]];
    (res.data as note[]).map((note) => {
      const fields = note.flds.split(noteFieldSplitCode);
      const commnet = note && note?.data !== "" ? JSON.parse(note.data) : null;
      download.push([
        note.sfld,
        fields && fields.length > 1 ? fields[1] : "",
        commnet && commnet.text ? (commnet.text as string) : "",
      ]);
    });
    const href = URL.createObjectURL(
      new Blob(["\uFEFF" + download.join("\r\n")], {
        type: `type: "text/csv;charset=UTF-8"`,
      })
    );
    const fileName = `${user.name}-notes.csv`;
    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = href;
    link.setAttribute("download", decodeURI(fileName)); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
};

export default useExportCards;
