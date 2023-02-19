import * as pdfJS from "pdfjs-dist";
import { pdfLinkService } from "./BasicService";

export const annotations: any[] = [];
export const clickHandler = (
  event: MouseEvent,
  pdf: pdfJS.PDFDocumentProxy
) => {
  event.preventDefault(); // 阻止 a 标签点击事件的默认行为
  const _target = event.target as HTMLLinkElement;
  const id = _target.getAttribute("data-element-id")!;
  const annotation_filter = annotations.filter(
    (annotation) => annotation.id === id
  );
  if (annotation_filter.length > 0) {
    const annotation = annotation_filter[0];
    if (annotation.url) {
      window.open(annotation.url, "_blank")?.focus();
      return;
    }
    pdf.getDestination(annotation.dest).then((dest) => {
      dest &&
        pdf.getPageIndex(dest[0]).then((page) => {
          goPage(page + 1);
        });
    });
  }
};

export const goPage = (i: number) => {
  const targetPage = document.getElementById(
    `pageContainer${i}`
  ) as HTMLDivElement;
  targetPage.scrollIntoView({ behavior: "auto" });
};
export const loadAnnotation = async (
  annotationContainer: HTMLDivElement,
  pdf: pdfJS.PDFDocumentProxy,
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
  Array.from(annotationContainer.getElementsByClassName("popupDate")).map(
    // eslint-disable-next-line array-callback-return
    (date_time) => {
      const _target = date_time as HTMLSpanElement;
      const message = JSON.parse(_target.getAttribute("data-l10n-args")!);
      _target.innerText = `${message.date} ${message.time}`;
    }
  );
  annotation.forEach((ann) => {
    annotations.push(ann);
  });
  // eslint-disable-next-line array-callback-return
  Array.from(annotationContainer.getElementsByTagName("a")).map((a) => {
    a.addEventListener("click", (event) => {
      clickHandler(event, pdf);
    });
  });
  return annotation;
};
