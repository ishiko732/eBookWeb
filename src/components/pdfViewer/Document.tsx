import * as pdfJS from "pdfjs-dist";
import { useEffect, useState } from "react";
// import {
//   createPDFViewer,
//   pdfFindController,
//   pdfLinkService,
//   pdfScriptingManager,
// } from "./base";
pdfJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

const usePDFDocument = (props: { option: any }) => {
  const [loading, setLoading] = useState(true);
  const [pdf, setPDF] = useState<pdfJS.PDFDocumentProxy | undefined>();
  useEffect(() => {
    if (props.option && props.option.url) {
      setLoading(true);
      (async () => {
        const pdf = await pdfJS.getDocument(props.option).promise;
        // const viewer = document.getElementById(
        //   "viewerContainer"
        // ) as HTMLDivElement;
        // const pdfViewer = createPDFViewer(viewer);
        // pdfLinkService.setViewer(pdfViewer);
        // pdfLinkService.setDocument(pdf);
        // pdfFindController.setDocument(pdf);
        // pdfScriptingManager.setViewer(pdfViewer);
        // pdfScriptingManager.setDocument(pdf);
        setPDF(pdf);
      })();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.option]);
  return {
    loading,
    pdf: pdf,
  };
};

export default usePDFDocument;
