import "vditor/dist/index.css";
import React, { useEffect } from "react";
import Vditor from "vditor";
import { defaultLanguage } from "../../config/config";
import { uploadImage, viewFileURL } from "../../api/file";
import { topic } from "../../api/models";
import { updateTopic } from "../../api/note";

const VditorEdit = (props: {
  style?: React.CSSProperties;
  topic: topic;
  setTopic: React.Dispatch<React.SetStateAction<topic | null | undefined>>;
}) => {
  const [vd, setVd] = React.useState<Vditor>();
  const editRef = React.createRef<HTMLDivElement>();
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

  React.useEffect(() => {
    const save = (event: KeyboardEvent) => {
      // event.stopPropagation()
      if (!vd) {
        return;
      }
      if (!props.topic) {
        return;
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === "s"
      ) {
        event.preventDefault();
        updateTopic({
          ...props.topic,
          data: vd.getValue(),
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    window.addEventListener("keydown", save);
    return () => {
      window.removeEventListener("keydown", save);
    };
  });

  useEffect(() => {
    if (!props.topic) {
      return;
    }
    if (first.current === props.topic.id) {
      return;
    }
    first.current = props.topic.id;
    console.log(props.topic.data);
    vd && vd.setValue(props.topic.data || "");
  }, [props.topic, vd]);
  return (
    <div id="vditor" className="vditor" style={props.style} ref={editRef} />
  );
};

export default VditorEdit;
