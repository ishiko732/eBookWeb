import "vditor/dist/index.css";
import React, { Fragment } from "react";
import Vditor from "vditor";
import { defaultLanguage } from "../../config/config";
import { uploadImage, viewFileURL } from "../../api/file";
const VditorNoteEdit = (props: {
  style?: React.CSSProperties;
  defaultText?: string;
  id: string;
  vd: Vditor | undefined;
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>;
}) => {
  const { vd, setVd, defaultText, id } = props;
  const editRef = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    vd && vd.setValue(defaultText || "");
  }, [defaultText, vd]);
  React.useEffect(() => {
    const _target = editRef.current
      ?.querySelector("div.vditor-ir")
      ?.querySelector("pre.vditor-reset");
    if (_target) {
      (_target as HTMLPreElement).setAttribute("style", "padding:4px");
    }
  });

  React.useEffect(() => {
    const vditor = new Vditor(`vditor-${id}`, {
      mode: "ir",
      lang: localStorage.language || defaultLanguage,
      width: "70%",
      toolbar: [],
      toolbarConfig: {
        hide: false,
        pin: false,
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
      hint: {
        emojiPath:
          "https://cdn.jsdelivr.net/npm/vditor@3.2.0/dist/images/emoji",
      },
      after: () => {
        vditor.disabledCache();
        defaultText && vditor.setValue(defaultText);
        setVd(vditor);
      },
    });
  }, []);
  return (
    <Fragment>
      <div
        id={`vditor-${id}`}
        className="vditor"
        style={props.style}
        ref={editRef}
      />
    </Fragment>
  );
};

export default VditorNoteEdit;
