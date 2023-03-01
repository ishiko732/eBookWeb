import "vditor/dist/index.css";
import React, { Fragment, useEffect } from "react";
import Vditor from "vditor";
import { defaultLanguage } from "../../config/config";
import { uploadImage, viewFileURL } from "../../api/file";
import { topic } from "../../api/models";
import { updateTopic } from "../../api/note";
import { useReadContext } from "./ReadContext";
import { Chip, Divider, SvgIcon } from "@mui/material";
import { isMac } from "../../utils/getSystem";
import SaveIcon from "@mui/icons-material/Save";
import { timer } from "../../utils/sleep";
import DoneIcon from "@mui/icons-material/Done";
const VditorEdit = (props: { style?: React.CSSProperties }) => {
  const { topic, setTopic, vd, setVd } = useReadContext();
  const editRef = React.createRef<HTMLDivElement>();
  const [selected, setSelected] = React.useState(false);
  const first = React.useRef("");
  React.useEffect(() => {
    const vditor = new Vditor("vditor", {
      lang: localStorage.language || defaultLanguage,
      toolbarConfig: {
        hide: true,
      },
      resize: {
        enable: true,
        position: "bottom",
      },
      preview: {
        hljs: {
          lineNumber: true,
        },
      },
      counter: {
        enable: true,
        type: "text",
      },
      upload: {
        accept: "image/*",
        // headers:{
        //   "Authorization":`Bearer ${localstorage.getItem(access_token)}`,
        //   // "Content-Type": "multipart/form-data"
        // },
        // url: BaseURL+"file/uploadImage",
        // linkToImgUrl: BaseURL+"file/uploadImage",
        // linkToImgCallback(responseText) {
        //   console.log(responseText)
        // },
        // success(editor, msg) {
        //   const json=JSON.parse(msg);
        //   Array.from(json.data.succMap).map((item:any)=>{
        //     const key:string=Object.keys(item)[0]
        //     const value:string=Object.values(item)[0] as string
        //     console.log(item,key);
        //     vditor.insertValue(`![${key}](${viewFileURL(value)})`)
        //   })
        // },
        // error(msg) {
        //     console.log("error",msg)
        // },
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
          return name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
            .replace("/\\s/g", "");
        },
      },
      icon: "material",
      after: () => {
        // vditor.setValue("`Vditor` 最小代码示例");
        vditor.enableCache();
        setVd(vditor);
      },
    });
  }, []);

  const saveText = (topic: topic, vd: Vditor) => {
    updateTopic({
      ...topic,
      // @ts-ignore
      name: undefined,
      data: vd.getValue(),
    })
      .then((res) => {
        setTopic(res.data);
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
      if (!topic) {
        return;
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "s"
      ) {
        event.preventDefault();
        saveText(topic, vd);
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "v"
      ) {
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
    if (!topic) {
      return;
    }
    if (first.current === topic.id) {
      return;
    }
    first.current = topic.id;
    console.log(topic.data);
    vd && vd.setValue(topic.data || "");
  }, [topic, vd]);
  return (
    <Fragment>
      <div id="vditor" className="vditor" style={props.style} ref={editRef} />
      <Divider textAlign="right">
        <Chip
          onClick={() => {
            if (!vd) {
              return;
            }
            if (!topic) {
              return;
            }
            saveText(topic, vd);
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
