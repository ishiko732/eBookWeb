import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { Loading } from "../../components/Loading";
import PDFViewer from "../../components/pdfViewer";
import { BaseURL } from "../../config/config";
import { access_token as access_string } from "../../config/token";

export const generenURL = (resourId: string) => {
  return `${BaseURL}file/views/${resourId}`;
};

export const documentInitParameters = (pdfURL: string) => {
  return {
    url: pdfURL,
    disableAutoFetch: false,
    disableRange: true,
    cMapUrl: "pdfjs-dist/cmaps/",
    cMapPacked: true,
    enableXfa: true,
    httpHeaders: {
      "Accept-Encoding": "Identity",
      Authorization: `Bearer ${localStorage.getItem(access_string)}`,
    },
    withCredentials: true,
  };
};
const DEFAULT_SCALE = 1.3;
const PDFBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resoureId = searchParams.get("resoure");

  return resoureId ? (
    <PDFViewer
      documentInitParameters={documentInitParameters(generenURL(resoureId))}
      scale={DEFAULT_SCALE}
    />
  ) : (
    <Loading />
  );
};

export default PDFBrowse;
