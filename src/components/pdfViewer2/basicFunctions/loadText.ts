import * as pdfJS from "pdfjs-dist";
export const loadText = async (
  textContainer: HTMLElement,
  page: pdfJS.PDFPageProxy,
  viewport: pdfJS.PageViewport
) => {
  const textContent = await page.getTextContent();
  pdfJS.renderTextLayer({
    textContentSource: textContent,
    container: textContainer,
    viewport: viewport,
    textDivs: [],
  });
  return textContent;
};
