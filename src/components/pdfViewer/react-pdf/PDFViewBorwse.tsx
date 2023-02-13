import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { viewFile } from "../../../api/file";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { Loading } from "../../Loading";
// import "pdfjs-dist/web/pdf_viewer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PDFViewBorwse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const resoureId = searchParams.get("resoure");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfURL, setPDFURL] = useState<string | null>(null);

  const PDFfile = (resoureId: string) => {
    viewFile(resoureId)
      .then((res) => {
        const href = URL.createObjectURL(
          new Blob([res.data], { type: res.headers["content-type"] })
        );
        setPDFURL(href);
      })
      .catch((err) => {
        navigate("/exception/404", { replace: true });
      });
  };
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet: any) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }
  React.useEffect(() => {
    if (resoureId == null) {
      navigate("/exception/404", { replace: true });
    } else {
      PDFfile(resoureId);
    }
  }, []);
  return pdfURL ? (
    <React.Fragment>
      <Document
        className="pdfViewer"
        file={pdfURL}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
          // enableXfa: true,
          // disableAutoFetch: false,
          // disableRange: true,
          // httpHeaders: {
          //   "Accept-Encoding": "Identity",
          //   "Authorization": `Bearer ${localStorage.getItem(access_string)}`
          // },
          // withCredentials: true,
        }}
        loading={<Loading />}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      {pageNumber > 1 && (
        <button onClick={changePageBack}>Previous Page</button>
      )}
      {numPages && pageNumber < numPages && (
        <button onClick={changePageNext}>Next Page</button>
      )}
    </React.Fragment>
  ) : (
    <Loading />
  );
}

export default PDFViewBorwse;
