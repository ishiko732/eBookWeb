import { AxiosProgressEvent } from "axios";
import { BaseURL } from "../config/config";
import request from "../config/request";
import * as vo from "./entity/file";
import { selectVo } from "./models";
// 初始化根目录
export const initFolder = (uid: number) =>
  request.get(`folder/initFolder?uid=${uid}`);

// 根据父目录ID获取子目录信息(包括文件)
export const getChildByParentId = (id: string) =>
  request.get(`folder/get/parent?parent_id=${id}`);

// 获取某用户的所有文件夹(没有父子层次关系)
export const getFoldersByUid = (uid: number) =>
  request.get(`folder/get?uid=${uid}`);

// 获取根目录
export const getTopFolder = (uid: number) =>
  request.get(`folder/get/root?uid=${uid}`);

// 通过文件夹名称获取文件夹Id(数组)
export const getFolderIdByUidAndFolderName = (
  uid: number,
  Folder_name: string
) => request.get(`folder/get/id?uid=${uid}&name=${Folder_name}`);

// 添加文件夹
export const addFolder = (params: vo.addFolderVo) =>
  request({
    method: "post",
    url: "folder/add",
    data: params,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 删除文件夹
export const deleteFolder = (folderId: number) =>
  request.delete(`folder/del?id=${folderId}`);

// 更新文件夹信息
export const updateFolder = (folderId: number, folderName: string) =>
  request.put(`folder/update?id=${folderId}&name=${folderName}`);

// 移动文件夹
export const moveFolder = (folderId: number, parentId: number) =>
  request.put(`folder/update?id=${folderId}&parent_id=${parentId}`);

// 上传文件
export const uploadFile = (
  file: File,
  parent_id: number,
  onUpload?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: "post",
    url: `file/upload/${parent_id}`,
    data: file,
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: [
      (data) => {
        const formData = new FormData();
        formData.append("file", data);
        return formData;
      },
    ],
    timeout: 0,
    onUploadProgress: onUpload,
  });

// 查看文件
export const viewFileURL = (fsId: string) => {
  return `${BaseURL}file/views/${fsId}`;
};

export const viewFile = (
  fsId: string,
  onDownload?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: "get",
    url: `file/views/${fsId}`,
    responseType: "blob", // important
    timeout: 0,
    onDownloadProgress: onDownload,
  });

export const downloadFile = (
  fsId: string,
  onDownload?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: "get",
    url: `file/download/${fsId}`,
    responseType: "blob", // important
    timeout: 0,
    onDownloadProgress: onDownload,
  })
    .then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(
        new Blob([response.data], { type: "application/octet-stream" })
      );
      const fileName =
        response?.headers["content-disposition"]?.split("; filename=")[1] ||
        "file." + response?.headers["content-type"]?.split("/")[1];
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
    })
    .catch((err) => {
      console.log(err);
    });

// 查询文件信息通过文件Id
export const getFile = (fileId: number) => request.get(`file/${fileId}`);

// 查询文件信息通过资源Id
export const getFileByResourceId = (fsId: string) =>
  request.get(`file/resource/${fsId}`);

// 移动文件到指定文件夹
export const moveFile = (fileId: number, folderId: number) =>
  request.put(`folder/${fileId}?fid=${folderId}`);

// 更新文件信息
export const updateFile = (fileId: number, filename: string) =>
  request.put(`file/${fileId}?name=${filename}`);

// 删除文件信息
export const deleteFile = (fileId: number) => request.delete(`file/${fileId}`);

// 获取指定用户的所有媒体文件
export const filesByUid = (uid: number) => request.get(`file/files?id=${uid}`);

// 获取媒体文件列表
export const mediesList = (option?: selectVo) =>
  request.get(
    option ? `file/lists?page=${option.page}&size=${option.size}` : `file/lists`
  );
// 获取媒体文件列表 通过uid
export const mediesByUid = (uid: number, type?: 1 | null) =>
  request.get(
    type ? `file/files?id=${uid}&type=${type}` : `file/files?id=${uid}`
  );
