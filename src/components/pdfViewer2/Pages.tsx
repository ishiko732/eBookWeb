import { createRef, useEffect } from "react";
import { v4 } from "uuid";
import { SelectionText } from "./basicFunctions/SelectionText";
import Loader from "./Loader";
import { Page } from "./Page";
import { PageContext } from "./usePageContext";
import { usePDFContext } from "./usePDFContext";

export default function Pages(props: {
  children?: JSX.Element[] | JSX.Element;
  style?: any;
}) {
  const { pdf, loading } = usePDFContext();

  const PDFViewerRef = createRef<HTMLDivElement>();
  const value = {
    PDFViewerRef,
  };
  useEffect(() => {
    if (pdf) {
      SelectionText(PDFViewerRef);
    }
  }, [PDFViewerRef, pdf]);

  return (
    <PageContext.Provider value={value}>
      {loading ? (
        <Loader text="load document..." />
      ) : (
        <div
          id="viewer"
          className="pdfViewer"
          key={v4()}
          style={{ margin: "0 auto", ...props.style }}
          ref={PDFViewerRef}
        >
          {/* {props.children} */}
          {Array.from({ length: pdf?.numPages || 0 }).map((item, index) => {
            return <Page pageNumber={index + 1} />;
          })}
        </div>
      )}
    </PageContext.Provider>
  );
}
