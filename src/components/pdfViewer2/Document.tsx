import * as pdfJS from "pdfjs-dist";
import { useState, useEffect } from "react";
import { PDFContext } from "./usePDFContext";

export default function Document(props: {
  option: any;
  children: JSX.Element | JSX.Element[];
  scale: number;
  LoadingDocumentText?: string;
  LoadingInitiateText?: string;
}) {
  const [pdf, setPDF] = useState<pdfJS.PDFDocumentProxy | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadedDocument, setLoadedDocument] = useState(false);
  const [loadedOutline, setLoadedOutline] = useState(false);
  const [scale, setScale] = useState(props.scale);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showNavBar, setShowNavBar] = useState(false);
  const [loadingText, setLoadingText] = useState(
    props.LoadingDocumentText || "Loading document..."
  );
  const option = props.option;
  const value = {
    option,
    pdf,
    setPDF,
    loading,
    setLoading,
    scale,
    setScale,
    defaultWidth: width,
    defaultHeight: height,
    showNavBar,
    setShowNavBar,
    loadingText,
    loadedDocument,
    setLoadedDocument,
    loadedOutline,
    setLoadedOutline,
  };

  useEffect(() => {
    if (option && option.url) {
      (async () => {
        setLoading(true);
        setLoadedOutline(false);
        setLoadedDocument(false);
        pdfJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
        const pdf = await pdfJS.getDocument(option).promise;
        setPDF(pdf);
        setLoadedDocument(true);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option.url]);

  useEffect(() => {
    if (loadedDocument && pdf) {
      (async () => {
        setLoadingText(props.LoadingInitiateText || "Initializing document...");
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: props.scale });
        setHeight(viewport.height);
        setWidth(viewport.width);
        // setLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedDocument, props.scale]);
  return (
    <PDFContext.Provider value={value}>{props.children}</PDFContext.Provider>
  );
}
