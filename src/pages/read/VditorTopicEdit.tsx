import "vditor/dist/index.css";
import React, { Fragment, useEffect } from "react";
import Vditor from "vditor";
import { defaultLanguage } from "../../config/config";
import { uploadImage, viewFileURL } from "../../api/file";
import { topic } from "../../api/models";
import { createNote, deleteNote, updateTopic } from "../../api/note";
import { useReadContext } from "../../ReadContext";
import { Chip, Divider } from "@mui/material";
import { isMac } from "../../utils/getSystem";
import SaveIcon from "@mui/icons-material/Save";
import { timer } from "../../utils/sleep";
import DoneIcon from "@mui/icons-material/Done";
import { useUserContext } from "../../UserContext";
const VditorEdit = (props: { style?: React.CSSProperties }) => {
  const { topics, setTopics, topicIndex, vd, setVd, notes, setNotes } =
    useReadContext();
  const { user } = useUserContext();
  const editRef = React.createRef<HTMLDivElement>();
  const [selected, setSelected] = React.useState(false);
  const first = React.useRef("");
  React.useEffect(() => {
    const vditor = new Vditor("vditor", {
      // mode:"ir",
      mode: "wysiwyg",
      lang: localStorage.language || defaultLanguage,
      toolbarConfig: {
        hide: true,
      },
      cache:{
        enable:false
      },
      resize: {
        enable: true,
        position: "bottom",
      },
      preview: {
        hljs: {
          lineNumber: true,
          enable: true,
        },
        math: {
          inlineDigit: true,
        },
      },
      counter: {
        enable: true,
        type: "text",
      },
      upload: {
        accept: "image/*",
        fieldName: "file",
        linkToImgFormat: (responseText: string) => {
          console.log(responseText);
          return viewFileURL(responseText);
        },
        handler(files) {
          return (async () => {
            await uploadImage(files).then((res) =>
              // eslint-disable-next-line array-callback-return
              Array.from(res.data.succMap).map((item: any) => {
                const key: string = Object.keys(item)[0];
                const value: string = Object.values(item)[0] as string;
                vditor.insertValue(`![${key}](${viewFileURL(value)})`);
              })
            );
            return null;
          })();
        },
        multiple: true,
        withCredentials: true,
        filename(name) {
          return (
            name
              .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
              // eslint-disable-next-line no-useless-escape
              .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
              .replace("/\\s/g", "")
          );
        },
      },
      icon: "material",
      hint: {
        emojiPath:
          "https://cdn.jsdelivr.net/npm/vditor@3.2.0/dist/images/emoji",
      },
      comment: {
        enable: true,
        add(id, text) {
          createNote({
            topicId: topics[topicIndex].id,
            uid: user.id,
            comment: JSON.stringify({
              id: id,
              text: text,
            }),
          })
            .then((res) => {
              vd && saveText(topics, topicIndex, vd);
              setNotes((pre) => {
                const data = [...pre];
                data.push(res.data);
                return data;
              });
            })
            .catch((err) => {
              vd && vd.removeCommentIds([id]);
            });
        },
        remove(ids) {
          console.log(ids);
          setNotes((pre) => {
            const data = [...pre];
            const t = data.filter((note) => {
              const comment = note.data !== "" ? JSON.parse(note.data) : null;
              return (
                comment && comment["id"] && ids.indexOf(comment["id"]) !== -1
              );
            });
            t.forEach((note) => {
              console.log(note);
              deleteNote(note.id);
            });
            vd && saveText(topics, topicIndex, vd);
            return data.filter((node) => t.indexOf(node) === -1);
          });
        },
        scroll(top) {
          console.log(top, "scroll");
        },
        adjustTop(commentsData) {
          console.log(commentsData, "adjustTop");
        },
      },
      after: () => {
        setVd(vditor);
      },
    });
  }, []);

  const saveText = (topics: topic[], topicIndex: number, vd: Vditor) => {
    updateTopic({
      ...topics[topicIndex],
      // @ts-ignore
      name: undefined,
      data: vd.getValue(),
    })
      .then((res) => {
        setTopics((pre) => {
          const data = [...pre];
          data[topicIndex] = res.data;
          return data;
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setSelected(true);
    timer(1000).then(() => {
      setSelected(false);
    });
  };
  React.useEffect(() => {
    const save = (event: KeyboardEvent) => {
      // event.stopPropagation()
      if (!vd) {
        return;
      }
      if (topics.length <= topicIndex) {
        return;
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "s"
      ) {
        event.preventDefault();
        saveText(topics, topicIndex, vd);
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "v"
      ) {
        vd.blur();
        navigator.clipboard.readText().then((clipText) => {
          event.preventDefault();
          vd.insertValue(clipText);
        });
      }
    };
    window.addEventListener("keydown", save);
    return () => {
      window.removeEventListener("keydown", save);
    };
  });

  useEffect(() => {
    if (topics.length <= topicIndex) {
      return;
    }
    if (first.current === topics[topicIndex].id) {
      return;
    }
    first.current = topics[topicIndex].id;
    vd && vd.setValue(topics[topicIndex].data || "");
  }, [topicIndex, topics, vd]);
  return (
    <Fragment>
      <div id="vditor" className="vditor" style={props.style} ref={editRef} />
      <Divider textAlign="right">
        <Chip
          onClick={() => {
            if (!vd) {
              return;
            }
            if (topics.length <= topicIndex) {
              return;
            }
            saveText(topics, topicIndex, vd);
          }}
          color={selected ? "primary" : undefined}
          variant={selected ? "filled" : "outlined"}
          onDelete={selected ? () => {} : undefined}
          icon={<SaveIcon />}
          deleteIcon={<DoneIcon />}
          label={isMac ? "⌘S" : "Ctrl-S"}
        />
      </Divider>
    </Fragment>
  );
};

export default VditorEdit;
