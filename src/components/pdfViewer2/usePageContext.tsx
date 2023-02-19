import { createContext, useContext } from "react";
export interface PagesProviderContext {
  PDFViewerRef: React.RefObject<HTMLDivElement>;
}

// @ts-ignore
export const PageContext = createContext<PagesProviderContext>();

export function usePageContext() {
  return useContext(PageContext);
}
