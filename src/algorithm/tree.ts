import { folder } from "../api/models";
import { TreeData } from "../components/tree-view/CustomTreeView";
import { findItem } from "./graph";

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
        children: folder.files
          ? folder.files.map((file) => {
              const filenameLower = file.filename.toLowerCase();
              const isPdf = filenameLower.endsWith(".pdf");
              const isTopic = filenameLower.endsWith(".topic");
              const fileType = isPdf ? "PDF" : isTopic ? "Topic" : "File";
              return {
                id: `${fileType}_${file.id}`,
                name:
                  fileType === "File"
                    ? file.filename
                    : file.filename.substring(
                        0,
                        file.filename.lastIndexOf(".")
                      ),
                disabledButton: false,
                type: fileType,
              };
            })
          : [],
      });
    });
  return tree;
};

export const treeUnique = (trees: TreeData[]): TreeData[] => {
  const resTree: TreeData[] = [];
  // eslint-disable-next-line array-callback-return
  trees.forEach((tree: TreeData, index: number) => {
    if (index === 0 || trees[index]?.id !== trees[index - 1]?.id) {
      const _index = resTree.push(tree) - 1;
      if (resTree[_index].children) {
        resTree[_index].children = treeUnique(
          resTree[_index].children as TreeData[]
        );
      }
    }
  });
  return resTree;
};

export const toTree = (
  dates: TreeData[],
  parentId: string,
  childNode: TreeData[]
): any => {
  const parent: TreeData | null = findItem(dates, parentId, "id", "children");
  if (parent) {
    if (parent.children) {
      // eslint-disable-next-line array-callback-return
      childNode.map((node) => {
        let add = true;
        parent.children?.forEach((item) => {
          if (item.id === node.id) {
            add = false;
          }
        });
        add && parent.children?.unshift(node);
      });
    } else {
      parent.children = childNode;
    }
  }
  return dates;
};
