import * as pdfJS from "pdfjs-dist";
import { loadAnnotation } from "./loadAnnotation";
import { loadText } from "./loadText";

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

export const loadBeforeAfterPage = (
  pages: number[],
  pdf: pdfJS.PDFDocumentProxy,
  scale: number
) => {
  // eslint-disable-next-line array-callback-return
  pages.map((pageNumber) => {
    const page = document.getElementById(
      `pageContainer${pageNumber}`
    ) as HTMLDivElement | null;
    if (page && page.getAttribute("data-loaded") === "false") {
      // noinspection JSIgnoredPromiseFromCall
      loadPage(pdf, pageNumber, scale);
    }
  });
};

//https://github.com/mzabriskie/pdf-textlayer-example/blob/master/index.js
export const loadPage = async (
  pdf: pdfJS.PDFDocumentProxy,
  pageNumber: number,
  scale: number
) => {
  const page_div = document.getElementById(
    `pageContainer${pageNumber}`
  ) as HTMLDivElement;
  const loader = page_div.querySelector(".loader");
  const canvas = page_div.querySelector("canvas") as HTMLCanvasElement;
  const wrapper = page_div.querySelector(".canvasWrapper") as HTMLDivElement;
  const textContainer = page_div.querySelector(".textLayer") as HTMLDivElement;
  const annotationContainer = page_div.querySelector(
    ".annotationLayer"
  ) as HTMLDivElement;
  // console.log("加载page",pageNumber)
  page_div.setAttribute("data-loaded", "true");
  const pdfPage = await pdf.getPage(pageNumber);
  const viewport = pdfPage.getViewport({ scale: scale });
  const outputScale = window.devicePixelRatio || 1;
  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
  canvas.height = viewport.height * outputScale;
  canvas.width = viewport.width * outputScale;
  canvas.style.width = viewport.width + "px";
  canvas.style.height = viewport.height + "px";
  page_div.style.width = canvas.style.width;
  page_div.style.height = canvas.style.height;
  page_div.style.setProperty("--scale-factor", `${scale}`);
  wrapper.style.width = canvas.style.width;
  wrapper.style.height = canvas.style.height;

  const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
  const renderContext: any = {
    canvasContext: canvasContext,
    viewport: viewport,
    transform: transform,
  };
  await pdfPage.render(renderContext).promise;
  canvas.setAttribute("data-img", canvas.toDataURL("image/jpeg", 0.4));
  await loadText(textContainer, pdfPage, viewport);
  await loadAnnotation(annotationContainer, pdf, pdfPage, viewport);
  if (loader) {
    // console.log("移除loader",pageNumber)
    loader.innerHTML = "";
    loader.parentNode?.removeChild(loader);
  }
  return true;
};
