import {
  PDFViewer,
  EventBus,
  PDFLinkService,
  PDFFindController,
  PDFScriptingManager,
  PDFHistory,
  NullL10n,
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

//https://github.com/mzabriskie/pdf-textlayer-example/blob/master/index.js
export const createEmptyPage = (
  pageNumber: number,
  defaultWidth?: number,
  defaultHeight?: number
) => {
  const page = document.createElement("div");
  const canvas = document.createElement("canvas");
  const wrapper = document.createElement("div");
  const textLayer = document.createElement("div");
  const annotationLayer = document.createElement("div");

  page.className = "page";
  wrapper.className = "canvasWrapper";
  textLayer.className = "textLayer";
  annotationLayer.className = "annotationLayer";
  wrapper.style.boxShadow = "0 0 3px #bbb";

  page.setAttribute("id", `pageContainer${pageNumber}`);
  page.setAttribute("data-loaded", "false");
  page.setAttribute("data-page-number", `${pageNumber}`);

  canvas.setAttribute("id", `page${pageNumber}`);

  if (defaultHeight && defaultWidth) {
    const outputScale = window.devicePixelRatio || 1;
    canvas.height = defaultHeight * outputScale;
    canvas.width = defaultWidth * outputScale;
    canvas.style.width = defaultWidth + "px";
    canvas.style.height = defaultHeight + "px";
    page.style.width = canvas.style.width;
    page.style.height = canvas.style.height;
    wrapper.style.width = canvas.style.width;
    wrapper.style.height = canvas.style.height;
  }
  page.appendChild(wrapper);
  page.appendChild(textLayer);
  page.appendChild(annotationLayer);
  wrapper.appendChild(canvas);
  return page;
};

export const getBeforeAfter = (x: number, max: number, range: number) => {
  let lowerBound = Math.max(1, x - range); // 下界
  let upperBound = Math.min(max, x + range); // 上界
  if (range * 2 + 1 > max) {
    return Array.from({ length: max }, (_, i) => 1 + i); // 获取前后共max个数
  }
  while (upperBound - lowerBound + 1 < range * 2 + 1) {
    if (lowerBound === 1) {
      upperBound = Math.min(max, upperBound + 1);
    } else if (upperBound === max) {
      lowerBound = Math.max(1, lowerBound - 1);
    } else if (x - lowerBound <= upperBound - x) {
      upperBound = Math.min(max, upperBound + 1);
    } else {
      lowerBound = Math.max(1, lowerBound - 1);
    }
  }
  return Array.from(
    { length: upperBound - lowerBound + 1 },
    (_, i) => lowerBound + i
  ); // 获取前后共2*range+1个数
};
