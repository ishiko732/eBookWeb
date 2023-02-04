import { folder } from "../api/models";
import { TreeData } from "../components/tree-view/CustomTreeView";

export const toTreeData = (folders: folder[]): TreeData[] => {
  const tree: TreeData[] = [];
  Array.isArray(folders) &&
    // eslint-disable-next-line array-callback-return
    folders.map((folder) => {
      tree.push({
        id: `Folder_${folder.id}`,
        name: folder.name,
        disabledButton: false,
        type: "Folder",
        children: folder.files.map((file) => {
          const filenameLower = file.filename.toLowerCase();
          const isPdf = filenameLower.endsWith(".pdf");
          const isTopic = filenameLower.endsWith(".topic");
          const fileType = isPdf ? "PDF" : isTopic ? "Topic" : "File";
          return {
            id: `${fileType}_${file.id}`,
            name:
              fileType === "File"
                ? file.filename
                : file.filename.substring(0, file.filename.lastIndexOf(".")),
            disabledButton: false,
            type: fileType,
          };
        }),
      });
    });
  return tree;
};
