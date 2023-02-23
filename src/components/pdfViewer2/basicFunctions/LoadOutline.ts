import * as pdfJS from "pdfjs-dist";
export interface pdfJS_outline {
  title: string;
  bold: boolean;
  italic: boolean;
  /**
   * - The color in RGB format to use for
   * display purposes.
   */
  color: Uint8ClampedArray;
  dest: string | Array<any> | null;
  url: string | null;
  unsafeUrl: string | undefined;
  newWindow: boolean | undefined;
  count: number | undefined;
  items: any[];
}

export interface viewer_outline {
  title: string;
  url: string | null;
  dest: string | Array<any> | null;
  ref: Array<any> | null;
  page: number | null;
  children: viewer_outline[];
}
const getVo = (pdf: pdfJS.PDFDocumentProxy, items: pdfJS_outline[]) => {
  const outline: viewer_outline[] = new Array(items.length);
  items &&
    items.length > 0 &&
    items.forEach(async (item, index) => {
      if (typeof item.dest === "string") {
        const dest = await pdf.getDestination(item.dest);
        if (dest) {
          const pageNumber = await pdf.getPageIndex(dest[0]);
          outline[index] = {
            title: item.title,
            url: item.url,
            dest: dest,
            ref: dest[0],
            page: pageNumber + 1,
            children: item.items.length > 0 ? getVo(pdf, item.items) : null,
          } as viewer_outline;
        }
      } else {
        outline[index] = {
          title: item.title,
          url: item.url,
          children: item.items.length > 0 ? getVo(pdf, item.items) : null,
        } as viewer_outline;
      }
    });
  return outline.sort();
};

const getOutline = async (props: { pdf: pdfJS.PDFDocumentProxy }) => {
  // pdf.getOutline get dest
  // url? open url
  // items? getOutline
  // pdf.getDestination get ref {num,gen}
  // pdf.getPageIndex get pageNumber;
  const { pdf } = props;
  const pdf_outline: pdfJS_outline[] = await pdf.getOutline();
  return getVo(pdf, pdf_outline);
};
export default getOutline;
