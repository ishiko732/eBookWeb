import * as pdfJS from "pdfjs-dist";
import { useLayoutEffect, useRef } from "react";
import { getBeforeAfter, pdfLinkService } from "./base";
import "pdfjs-dist/web/pdf_viewer.css";
import { v4 } from "uuid";

export const loadPage = async (
  pdf: pdfJS.PDFDocumentProxy,
  pageNumber: number,
  scale: number
) => {
  const page_div = document.getElementById(
    `pageContainer${pageNumber}`
  ) as HTMLDivElement;
  const canvas = page_div.querySelector("canvas") as HTMLCanvasElement;
  const wrapper = page_div.querySelector(".canvasWrapper") as HTMLDivElement;
  const textContainer = page_div.querySelector(".textLayer") as HTMLDivElement;
  const annotationContainer = page_div.querySelector(
    ".annotationLayer"
  ) as HTMLDivElement;
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
  await loadText(textContainer, pdfPage, viewport);
  await loadAnnotation(annotationContainer, pdfPage, viewport);
  pdfPage.render(renderContext);
  page_div.style.opacity = "1";
  return {
    page: pdfPage,
    viewport: viewport,
  };
};

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
export const loadAnnotation = async (
  annotationContainer: HTMLDivElement,
  page: pdfJS.PDFPageProxy,
  viewport: pdfJS.PageViewport
) => {
  const annotation = await page.getAnnotations();
  pdfJS.AnnotationLayer.render({
    renderForms: true,
    viewport: viewport.clone({ dontFlip: true }),
    div: annotationContainer,
    annotations: annotation,
    page: page,
    linkService: pdfLinkService,
    downloadManager: null,
    enableScripting: true,
  });
  return annotation;
};
const outputScale = window.devicePixelRatio || 1;

export const loadBeforeAfterPage = (
  pages: number[],
  pdf: pdfJS.PDFDocumentProxy,
  scale: number
) => {
  pages.map((pageNumber) => {
    const page = document.getElementById(
      `pageContainer${pageNumber}`
    ) as HTMLDivElement | null;
    if (page && page.getAttribute("data-loaded") === "false") {
      // console.log("尝试加载数据", pageNumber);
      loadPage(pdf, pageNumber, scale);
    }
  });
};

export const Page: React.FC<{
  pdf: pdfJS.PDFDocumentProxy;
  pageNumber: number;
  defaultWidth?: number | undefined;
  defaultHeight?: number | undefined;
  // observer: IntersectionObserver;
  scale: number;
  loadContent?: boolean;
}> = (props) => {
  const { pageNumber, defaultHeight, defaultWidth /*observer*/ } = props;
  const totalPage = props.pdf._pdfInfo.numPages;
  const ref = useRef<HTMLDivElement | null>(null);
  const firstSubmitStatus = useRef(true);
  const firstLoadingStatus = useRef(true);
  const loadingRef = useRef<IntersectionObserver>(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { target, intersectionRatio } = entry;
          if (intersectionRatio > 0.5) {
            const _target = target as HTMLDivElement;
            const index = Number(_target.getAttribute("data-page-number"));
            const pages = getBeforeAfter(index, totalPage, 2);
            if (firstLoadingStatus.current) {
              firstLoadingStatus.current = false;
              loadBeforeAfterPage(pages, props.pdf, props.scale);
            }
            loadingRef.current.unobserve(_target);
          }
        });
      },
      {
        threshold: [0.5],
      }
    )
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    // observer.observe(ref.current);
    if (firstSubmitStatus.current) {
      firstSubmitStatus.current = false;
      if (props.loadContent) {
        loadPage(props.pdf, props.pageNumber, props.scale);
      } else {
        const page = document.getElementById(
          `pageContainer${pageNumber}`
        ) as HTMLDivElement;
        if (page) {
          loadingRef.current.observe(page);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      props.loadContent && loadingRef.current.disconnect();
      // observer.unobserve(ref.current as HTMLDivElement);
    };
  });
  const defaultStyle =
    defaultHeight && defaultWidth
      ? {
          width: defaultWidth + "px",
          height: defaultHeight + "px",
        }
      : undefined;
  return (
    <div
      className="page"
      id={`pageContainer${pageNumber}`}
      key={v4()}
      data-loaded="false"
      data-page-number={pageNumber}
      style={defaultStyle}
      ref={ref}
    >
      <div
        key={v4()}
        className="canvasWrapper"
        data-page-number={pageNumber}
        style={{ boxShadow: "0 0 3px #bbb", ...defaultStyle }}
      >
        <canvas
          id={`page${pageNumber}`}
          key={v4()}
          style={defaultStyle}
          height={defaultHeight ? defaultHeight * outputScale : undefined}
          width={defaultWidth ? defaultWidth * outputScale : undefined}
        />
      </div>
      <div key={v4()} className="textLayer"></div>
      <div key={v4()} className="annotationLayer"></div>
    </div>
  );
};
