import { createRef, Fragment, useEffect } from "react";
import { v4 } from "uuid";
import { selectionchange, SelectionText } from "./basicFunctions/SelectionText";
import Loader from "./Loader";
import Page from "./Page";
import { PageContext } from "./usePageContext";
import { usePDFContext } from "./usePDFContext";

export default function Pages(props: {
  children?: JSX.Element[] | JSX.Element;
  style?: any;
  loadingPageText?: string;
  handleText?: (event: Event) => void;
}) {
  const { pdf, loading, loadingText, defaultHeight } = usePDFContext();

  const PDFViewerRef = createRef<HTMLDivElement>();
  const value = {
    PDFViewerRef,
    loadingPageText: props.loadingPageText || "Loading Page",
  };
  useEffect(() => {
    if (!loading) {
      pdf && SelectionText(PDFViewerRef, props.handleText || selectionchange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
          {props.children}
          <AllPages numPages={pdf?.numPages || 0} />
        </div>
      ) : null}
    </PageContext.Provider>
  );
}

const AllPages = ({ numPages }: { numPages: number }) => {
  return (
    <Fragment>
      {Array.from({ length: numPages || 0 }).map((item, index) => {
        return (
          <Page pageNumber={index + 1} key={`pdfViewer-page-${index + 1}`} />
        );
      })}
    </Fragment>
  );
};
