import { memo, useEffect, useRef, useState } from "react";
import usePDFDocument from "./Document";
import { loadPage, Page } from "./Page";
import { Loading } from "../Loading";
import { v4 } from "uuid";
// import DocumentInitParameters from 'pdfjs-dist/types/src/display/api';

document.addEventListener("selectionchange", () => {
  //https://stackoverflow.com/questions/48950038/how-do-i-retrieve-text-from-user-selection-in-pdf-js
  console.log(
    window.getSelection()?.toString().replace(/\r\n/g, "").replace(/\n/g, "")
  );
});
const PDFViewer: React.FC<{ documentInitParameters: any; scale: number }> =
  memo((props) => {
    const io = useRef<IntersectionObserver>();
    const { loading, pdf } = usePDFDocument({
      option: props.documentInitParameters,
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPage] = useState<JSX.Element[]>([]);
    const goPage = (i: number) => {
      setCurrentPage(i);
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
    }, [pdf]);
    const createPages = async () => {
      const pages = [];
      const loadingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((item) => {
            const index = parseInt(
              item.target.getAttribute("data-page-number") || "0"
            );
            item.intersectionRatio >= 0.5 && setCurrentPage(index);
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
      // console.log(viewport.width+'px')
      viewer.style.width = `${viewport.width}px`;
      for (let index = 0; index < pdf!._pdfInfo.numPages; index++) {
        pages.push(
          <Page
            pdf={pdf!}
            pageNumber={index + 1}
            observer={io.current}
            scale={props.scale}
            defaultHeight={viewport.height}
            defaultWidth={viewport.width}
            loadContent={true}
          />
        );
      }
      setPage(pages);
    };

    return loading ? (
      <Loading />
    ) : (
      <div
        id="viewer"
        className="pdfViewer"
        key={v4()}
        style={{ margin: "0 auto" }}
      >
        {pdf && pages}
      </div>
    );
  });
export default PDFViewer;
