import React from "react";
import { useEffect } from "react";
import {
  topicsToTreeData,
  toTreeData,
  notesToTreeData,
} from "../../algorithm/tree";
import { getChildByParentId, getFile } from "../../api/file";
import { file, folder, note, topic } from "../../api/models";
import { queryTopics, queryNotes } from "../../api/note";
import AccordionItems, { AccordionItem } from "../../components/AccordionItems";
import FileTreeView from "../../components/file-tree/FileTreeView";
import { viewer_outline } from "../../components/pdfViewer2/basicFunctions/LoadOutline";
import { goPage } from "../../components/pdfViewer2/navigationComponents/CurrentPage";
import { OutlineItems } from "../../components/pdfViewer2/navigationComponents/OutlineItems";
import { TreeData, TreeType } from "../../components/tree-view/CustomTreeView";
import { useUserContext } from "../../UserContext";
import { task } from "../../utils/sleep";
import { SelectTextContent } from "./SelectTextContent";

const ExcerptTree = (props: {
  treeData: TreeData[];
  setTreeData: React.Dispatch<React.SetStateAction<TreeData[]>>;
  file: file | null | undefined;
  setFile: React.Dispatch<React.SetStateAction<file | null | undefined>>;
  outline: viewer_outline[];
  resouceId: string;
  setResouceId: React.Dispatch<React.SetStateAction<string>>;
  textRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const { resouceId, setResouceId, treeData, file, setFile, outline, textRef } =
    props;
  const [items, setItems] = React.useState<AccordionItem[]>([]);
  const { user, t } = useUserContext();
  const handleSelectNode = (selectedFilesNode: TreeData[]) => {
    if (!selectedFilesNode) {
      return;
    }
    const file = selectedFilesNode.at(-1);
    if (file && file.type === "PDF" && file.resoureId) {
      if (resouceId !== "") {
        goPage(1);
        setResouceId("");
        task();
      }
      const fileId = Number(file.id.split("_").at(-1));
      getFile(Number(fileId)).then((res) => setFile(res.data));
      setResouceId(file.resoureId);
    }
  };

  const selectTextJSX = {
    title: t("read.selectTexts") as string,
    details: (
      <SelectTextContent
        textRef={textRef}
        style={{ minHeight: document.body.offsetHeight * 0.05 }}
      />
    ),
    defaultExpanded: false,
  };
  useEffect(() => {
    const newFilesJSX: AccordionItem = {
      title: t("read.files") as string,
      details: (
        <FileTreeView
          data={treeData}
          operation={operation}
          loginUser={user}
          handleSelectNode={handleSelectNode}
        />
      ),
      defaultExpanded: props.outline.length === 0,
    };
    const outlineAccordionItemsJSX: AccordionItem = {
      title: t("read.outline") as string,
      details: <OutlineItems outline={outline} />,
      defaultExpanded: outline.length > 0,
    };
    const arr = [];
    arr.push(newFilesJSX);
    outline.length > 0 && arr.push(outlineAccordionItemsJSX);
    file && arr.push(selectTextJSX);
    setItems(arr);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, outline, file]);

  return <AccordionItems items={items} />;
};

export default ExcerptTree;

async function operation(type_id: string) {
  let ret: { status: boolean; data: any } = { status: false, data: null };
  const [type, id] = type_id.split("_");
  const _type = type as TreeType;
  if (_type === "Folder") {
    await getChildByParentId(id)
      .then((res) => {
        ret = { status: true, data: toTreeData(res.data as folder[]) };
      })
      .catch((err) => {
        ret = { status: false, data: err };
      });
  } else if (_type === "PDF") {
    console.log(_type, id);
    await queryTopics({ fileId: Number(id) })
      .then((res) => {
        if ((res.data as topic[]).length === 0) {
          return;
        }
        ret = { status: true, data: topicsToTreeData(res.data as topic[]) };
      })
      .catch((err) => {
        console.log(err);
        ret = { status: false, data: err };
      });
  } else if (_type === "Topic") {
    const data: TreeData[] = [];
    await queryTopics({ topicId: id })
      .then((res) => {
        if ((res.data as topic[]).length === 0) {
          return;
        }
        data.push(...topicsToTreeData(res.data as topic[]));
      })
      .catch((err) => {
        console.log(err);
        ret = { status: false, data: err };
      });
    !ret.data &&
      (await queryNotes({ topicId: id })
        .then((res) => {
          if ((res.data as note[]).length === 0) {
            return;
          }
          data.push(...notesToTreeData(res.data as note[]));
        })
        .catch((err) => {
          console.log(err);
          ret = { status: false, data: err };
        }));
    if (!ret.data) {
      ret = { status: true, data: data };
    }
  }
  return ret;
}
