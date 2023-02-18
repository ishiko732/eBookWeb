import { commentTree, file, folder } from "../api/models";
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
        children: folder.files ? filesToTreeData(folder.files) : [],
      });
    });
  return tree;
};

export const filesToTreeData = (files: file[]): TreeData[] => {
  return files?.map((file) => {
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
      resoureId: file.fsId,
    };
  });
};

export const treeUnique = (trees: TreeData[]): TreeData[] => {
  const resTree: TreeData[] = [];
  // eslint-disable-next-line array-callback-return
  trees.forEach((tree: TreeData, index: number) => {
    const cnt = resTree.filter((tree) => tree.id === trees[index].id).length;
    if (cnt === 0) {
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
    if (parent.children && parent.children.length > 0) {
      // eslint-disable-next-line array-callback-return
      childNode.forEach((node) => {
        if (node.type === "Folder") {
          parent?.children?.unshift(node);
        } else {
          parent?.children?.push(node);
        }
      });
    } else {
      parent.children = childNode;
    }
  }
  return treeUnique(dates);
};

export const commentToTree = (
  dates: commentTree[],
  parentId: number | null,
  childNode: commentTree
): any => {
  if (parentId === null) {
    dates.push(childNode);
    return dates;
  } else {
    const parent: commentTree | null = findItem(
      dates,
      parentId,
      "cid",
      "children"
    );
    if (parent) {
      if (parent.children && parent.children.length > 0) {
        parent?.children?.push(childNode);
      } else {
        parent.children = [childNode];
      }
    }
  }
  return commentTreeUnique(dates);
};

export const commentTreeUnique = (trees: commentTree[]): commentTree[] => {
  const resTree: commentTree[] = [];
  // eslint-disable-next-line array-callback-return
  trees.forEach((tree: commentTree, index: number) => {
    const cnt = resTree.filter((tree) => tree.cid === trees[index].cid).length;
    if (cnt === 0) {
      const _index = resTree.push(tree) - 1;
      if (resTree[_index].children) {
        resTree[_index].children = commentTreeUnique(
          resTree[_index].children as commentTree[]
        );
      }
    }
  });
  return resTree;
};
