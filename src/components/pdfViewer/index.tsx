import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import usePDFDocument from "./Document";
import { loadPage, Page } from "./Page";
import { v4 } from "uuid";
import styled from "@emotion/styled";
import { LinearProgress } from "@mui/material";
// import DocumentInitParameters from 'pdfjs-dist/types/src/display/api';

document.addEventListener("selectionchange", () => {
  //https://stackoverflow.com/questions/48950038/how-do-i-retrieve-text-from-user-selection-in-pdf-js
  console.log(
    window.getSelection()?.toString().replace(/\r\n/g, "").replace(/\n/g, "")
  );
});
const PDFViewer: React.FC<{
  documentInitParameters: any;
  scale: number;
  style?: any;
}> = (props) => {
  const io = useRef<IntersectionObserver>();
  const { loading, pdf } = usePDFDocument({
    option: props.documentInitParameters,
  });
  let currentPage = 0;
  const [pages, setPage] = useState<JSX.Element[]>([]);
  // const firstSubmitStatus = useRef(false);
  const goPage = (i: number) => {
    // setCurrentPage(i);
    currentPage = i;
    const targetPage = document.getElementById(
      `pageContainer${i}`
    ) as HTMLDivElement;
    targetPage.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (pdf === undefined) {
      return () => {};
    }
    createPages();
    // firstSubmitStatus.current=true
  }, [pdf]);
  const createPages = async () => {
    const pages = [];
    const loadingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          const index = parseInt(
            item.target.getAttribute("data-page-number") || "0"
          );
          if (item.intersectionRatio >= 0.5) {
            currentPage = index;
            // console.log(index);
          }
          // if (item.intersectionRatio > 0) {
          //     const _target = item.target as HTMLDivElement
          //     if(_target.getAttribute("data-loaded") === "false"){
          //       console.log("尝试加载数据",index);
          //       loadPage(pdf!,index, props.scale);
          //     }
          //   }
        });
      },
      {
        threshold: [0.5],
      }
    );
    io.current = loadingObserver;
    if (!pdf) {
      return;
    }
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: props.scale });
    const viewer = document.getElementById("viewer") as HTMLDivElement;
    viewer.style.width = `${viewport.width}px`;
    for (let index = 0; index < pdf!._pdfInfo.numPages; index++) {
      pages.push(
        <Page
          pdf={pdf!}
          pageNumber={index + 1}
          // observer={io.current}
          scale={props.scale}
          defaultHeight={viewport.height}
          defaultWidth={viewport.width}
          loadContent={false}
        />
      );
    }
    setPage(pages);
  };

  useLayoutEffect(() => {
    Array.from(document.getElementsByClassName("page")).map((page) => {
      io.current?.observe(page);
    });
    return () => {
      io.current?.disconnect();
    };
  });

  return loading ? (
    <LinearProgress />
  ) : (
    <div
      id="viewer"
      className="pdfViewer"
      key={v4()}
      style={{ margin: "0 auto", ...props.style }}
    >
      {pdf && pages}
    </div>
  );
};
export default PDFViewer;
