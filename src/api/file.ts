import { AxiosProgressEvent } from "axios";
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

// 上传文件
export const uploadFile = (
  file: File,
  onUpload?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: "post",
    url: "file/upload",
    data: file,
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: [
      (data) => {
        let formData = new FormData();
        formData.append("files", data);
      },
    ],
    timeout: 0,
    onUploadProgress: onUpload,
  });

// 下载文件
export const downloadFile = (
  fsId: string,
  onDownload?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: "get",
    url: `file/download/${fsId}`,
    timeout: 0,
    onDownloadProgress: onDownload,
  });

// 移动文件到指定文件夹
export const moveFile = (fileId: number, folderId: number) =>
  request.put(`folder/file?id=${fileId}&fid=${folderId}`);

// 更新文件信息
export const updateFile = (fileId: number, filename: string) =>
  request.put(`folder/file?id=${fileId}&name=${filename}`);

// 获取指定用户的所有媒体文件
export const filesByUid = (uid: number) => request.get(`file/files?id=${uid}`);

// 获取媒体文件列表
export const mediesList = (option?: selectVo) =>
  request.get(
    option ? `file/lists?page=${option.page}&size=${option.size}` : `file/lists`
  );
