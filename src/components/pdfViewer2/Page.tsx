import React, { useEffect, useRef } from "react";
import { getBeforeAfter } from "../pdfViewer/base";
import "pdfjs-dist/web/pdf_viewer.css";
import { v4 } from "uuid";
import { usePDFContext } from "./usePDFContext";
import { loadBeforeAfterPage } from "./basicFunctions/LazyLoadPage";
import Loader from "./Loader";

export const Page: React.FC<{
  pageNumber: number;
}> = (props) => {
  const { pdf, defaultHeight, defaultWidth, scale } = usePDFContext();
  const { pageNumber } = props;
  const pageRef = useRef<HTMLDivElement | null>(null);
  const firstSubmitStatus = useRef(true);
  const firstLoadingStatus = useRef(true);
  useEffect(() => {
    if (!pdf) {
      return;
    }
    const totalPage = pdf.numPages;
    if (firstSubmitStatus.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const { target, intersectionRatio } = entry;
            if (intersectionRatio >= 0.3) {
              const _target = target as HTMLDivElement;
              const index = Number(_target.getAttribute("data-page-number"));
              const pages = getBeforeAfter(index, totalPage, 2);
              if (firstLoadingStatus.current) {
                firstLoadingStatus.current = false;
                loadBeforeAfterPage(pages, pdf, scale);
              }
              observer.unobserve(_target);
              observer.disconnect();
            }
          });
        },
        {
          threshold: [0.5],
        }
      );
      firstSubmitStatus.current = false;
      if (pageRef.current) {
        observer.observe(pageRef.current);
      }
    }
  }, [pdf, scale]);

  return (
    <div
      className="page"
      id={`pageContainer${pageNumber}`}
      key={v4()}
      data-loaded="false"
      data-page-number={pageNumber}
      style={createWidthAndHeightStyle(defaultHeight, defaultWidth)}
      ref={pageRef}
    >
      <div className={`loader`}>
        <Loader text={`load page ${pageNumber}`} inner />
      </div>
      <div
        key={v4()}
        className="canvasWrapper"
        data-page-number={pageNumber}
        style={{
          boxShadow: "0 0 3px #bbb",
          ...createWidthAndHeightStyle(defaultHeight, defaultWidth),
        }}
      >
        <canvas
          id={`page${pageNumber}`}
          key={v4()}
          style={createWidthAndHeightStyle(defaultHeight, defaultWidth)}
          height={defaultHeight ? defaultHeight * outputScale : undefined}
          width={defaultWidth ? defaultWidth * outputScale : undefined}
        />
      </div>
      <div key={v4()} className="textLayer"></div>
      <div key={v4()} className="annotationLayer"></div>
    </div>
  );
};

const outputScale = window.devicePixelRatio || 1;
const createWidthAndHeightStyle = (
  defaultHeight: number,
  defaultWidth: number
) => {
  return defaultHeight && defaultWidth
    ? {
        width: defaultWidth + "px",
        height: defaultHeight + "px",
      }
    : undefined;
};
