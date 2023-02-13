import {
  PDFViewer,
  EventBus,
  PDFLinkService,
  PDFFindController,
  PDFScriptingManager,
} from "pdfjs-dist/web/pdf_viewer";
import React, { useLayoutEffect, useRef } from "react";
import * as pdfJS from "pdfjs-dist";

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
