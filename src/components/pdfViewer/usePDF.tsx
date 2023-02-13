import React, { useEffect, useState } from "react";
import * as pdfJS from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { access_token as access_string } from "../../config/token";
import { BaseURL } from "../../config/config";
import { useSearchParams } from "react-router-dom";
import { createEmptyPage, pdfLinkService } from "./base";
import { loadPage } from "./Page";
// pdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.js`;
// const pdfURL = "d2l-zh-pytorch-2.0.0.pdf";
// const pdfURL_Online =
//   "http://localhost:8080/file/views/63e38edd439bfe7e593da771";
// const pdfURL = "软件工程专业毕业设计工作时间安排.pdf";
const DEFAULT_SCALE = 1.1;
const loadingPDF = async (
  pdfURL: string,
  setPDF: React.Dispatch<
    React.SetStateAction<pdfJS.PDFDocumentProxy | undefined>
  >,
  setHeight: React.Dispatch<React.SetStateAction<number>>
) => {
  pdfJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
  const pdf = await pdfJS.getDocument({
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
  }).promise;
  setPDF(pdf);
  const viewer = document.getElementById("viewer") as HTMLDivElement;
  pdfLinkService.setViewer(viewer);
  pdfLinkService.setDocument(pdf);
  for (let index = 0; index < pdf._pdfInfo.numPages; index++) {
    const page = createEmptyPage(index + 1);
    viewer.appendChild(page);
  }
  const firstPage = await loadPage(pdf, 1, DEFAULT_SCALE);
  setHeight(firstPage.viewport.height);
};
const generenURL = (resourId: string) => {
  return `${BaseURL}file/views/${resourId}`;
};

function UsePDF() {
  const [pdf, setPDF] = useState<pdfJS.PDFDocumentProxy | undefined>();
  const [height, setHeight] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const firstCurrent = React.useRef(true);
  useEffect(() => {
    if (firstCurrent.current) {
      firstCurrent.current = false;
      const resoureId = searchParams.get("resoure");
      resoureId &&
        (async function () {
          await loadingPDF(generenURL(resoureId), setPDF, setHeight);
        })();
    }
  }, []);
  window.addEventListener("scroll", () => {
    const visiblePageNum = Math.round(window.scrollY / height) + 1;
    const visiblePage = document.querySelector(
      `.page[data-page-number="${visiblePageNum}"][data-loaded="false"]`
    );
    if (visiblePage) {
      setTimeout(() => {
        loadPage(pdf as pdfJS.PDFDocumentProxy, visiblePageNum, DEFAULT_SCALE);
      });
    }
  });

  return (
    <div id="viewerContainer">
      <div id="viewer" className="pdfViewer"></div>
    </div>
  );
}
export default UsePDF;
