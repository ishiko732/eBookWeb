import * as pdfJS from "pdfjs-dist";
import { useState, useEffect } from "react";
import { PDFContext } from "./usePDFContext";

export default function Document(props: {
  option: any;
  children: JSX.Element | JSX.Element[];
  scale: number;
}) {
  const [pdf, setPDF] = useState<pdfJS.PDFDocumentProxy | undefined>();
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(props.scale);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showNavBar, setShowNavBar] = useState(false);
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
  };

  useEffect(() => {
    if (option && option.url) {
      (async () => {
        setLoading(true);
        pdfJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
        const pdf = await pdfJS.getDocument(option).promise;
        setPDF(pdf);
        setLoading(false);
      })();
    }
  }, [option]);

  useEffect(() => {
    if (pdf) {
      (async () => {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: props.scale });
        setHeight(viewport.height);
        setWidth(viewport.width);
      })();
    }
  }, [pdf, props.scale]);
  return (
    <PDFContext.Provider value={value}>{props.children}</PDFContext.Provider>
  );
}
