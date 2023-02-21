import { createRef, useEffect } from "react";
import { v4 } from "uuid";
import { SelectionText } from "./basicFunctions/SelectionText";
import Loader from "./Loader";
import Page from "./Page";
import { PageContext } from "./usePageContext";
import { usePDFContext } from "./usePDFContext";

export default function Pages(props: {
  children?: JSX.Element[] | JSX.Element;
  style?: any;
  loadingPageText?: string;
}) {
  const { pdf, loading, loadingText, defaultHeight } = usePDFContext();

  const PDFViewerRef = createRef<HTMLDivElement>();
  const value = {
    PDFViewerRef,
    loadingPageText: props.loadingPageText || "Loading Page",
  };
  useEffect(() => {
    if (pdf) {
      SelectionText(PDFViewerRef);
    }
  }, [PDFViewerRef, pdf]);

  return (
    <PageContext.Provider value={value}>
      {loading ? <Loader text={loadingText} /> : null}
      {defaultHeight ? (
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
      ) : null}
    </PageContext.Provider>
  );
}