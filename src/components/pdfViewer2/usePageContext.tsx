import { createContext, useContext } from "react";
export interface PagesProviderContext {
  PDFViewerRef: React.RefObject<HTMLDivElement>;
  loadingPageText: string;
}

// @ts-ignore
export const PageContext = createContext<PagesProviderContext>();

export function usePageContext() {
  return useContext(PageContext);
}
