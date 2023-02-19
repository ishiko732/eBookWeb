import { createContext, useContext } from "react";
import * as pdfJS from "pdfjs-dist";
export interface ProviderContext {
  pdf: pdfJS.PDFDocumentProxy | undefined;
  setPDF: React.Dispatch<
    React.SetStateAction<pdfJS.PDFDocumentProxy | undefined>
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadingText: string;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  option: any;
  defaultHeight: number;
  defaultWidth: number;
  showNavBar: boolean;
  setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>;
}

// @ts-ignore
export const PDFContext = createContext<ProviderContext>();

export function usePDFContext() {
  return useContext(PDFContext);
}
