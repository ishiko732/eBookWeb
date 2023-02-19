import {
  EventBus,
  NullL10n,
  PDFFindController,
  PDFHistory,
  PDFLinkService,
  PDFScriptingManager,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";
export const eventBus = new EventBus();
export const pdfLinkService = new PDFLinkService({
  eventBus,
});
export const pdfFindController = new PDFFindController({
  linkService: pdfLinkService,
  eventBus: eventBus,
  updateMatchesCountOnProgress: false,
});
export const pdfScriptingManager = new PDFScriptingManager({
  eventBus,
  sandboxBundleSrc: "pdfjs-dist/build/pdf.sandbox",
});

export function createPDFViewer(container: HTMLDivElement) {
  return new PDFViewer({
    container: container,
    linkService: pdfLinkService,
    eventBus: eventBus,
    l10n: NullL10n,
  });
}

export const pdfHistory = new PDFHistory({
  eventBus,
  linkService: pdfLinkService,
});
pdfLinkService.setHistory(pdfHistory);
