import React, {
  createRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import usePDFDocument from "./Document";
import { Page } from "./Page";
import { v4 } from "uuid";
import { Box, Fab, LinearProgress, TextField, Typography } from "@mui/material";
import { goPage } from "./base";
// import DocumentInitParameters from 'pdfjs-dist/types/src/display/api';
const PDFViewer: React.FC<{
  documentInitParameters: any;
  scale: number;
  style?: any;
}> = (props) => {
  const io = useRef<IntersectionObserver>();
  const { loading, pdf } = usePDFDocument({
    option: props.documentInitParameters,
  });
  const [pages, setPage] = useState<JSX.Element[]>([]);
  const currentPageRef = useRef<HTMLInputElement>(null);
  const PDFViewerRef = createRef<HTMLDivElement>();
  useEffect(() => {
    if (pdf === undefined) {
      return () => {};
    }
    // noinspection JSIgnoredPromiseFromCall
    createPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf]);

  useEffect(() => {
    const selectionchange = (event: Event) => {
      //https://stackoverflow.com/questions/48950038/how-do-i-retrieve-text-from-user-selection-in-pdf-js
      const text = window
        .getSelection()
        ?.toString()
        .replace(/\r\n/g, "")
        .replace(/\n/g, "");
      text !== "" && console.log(text);
    };
    if (!PDFViewerRef.current) {
      return;
    }
    const _target = PDFViewerRef.current;
    _target.addEventListener("mouseup", selectionchange);
    return () => {
      _target.removeEventListener("mouseup", selectionchange);
    };
  });

  const createPages = async () => {
    const pages = [];
    io.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          if (item.intersectionRatio > 0.5) {
            (item.target as HTMLDivElement).setAttribute("checked", "");
            // (document.getElementById('currentPage') as HTMLDivElement).innerText=item.target.getAttribute("data-page-number")!
            if (currentPageRef.current) {
              currentPageRef.current!.value =
                item.target.getAttribute("data-page-number")!;
            }
            // console.log(item.target.getAttribute("data-page-number"));
          } else {
            (item.target as HTMLDivElement).removeAttribute("checked");
          }
          // item.intersectionRatio >0 && console.log(index,item.intersectionRatio)
        });
      },
      {
        threshold: 0.5,
      }
    );
    if (!pdf) {
      return;
    }
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: props.scale });
    const viewer = document.getElementById("viewer") as HTMLDivElement;
    viewer.style.width = `${viewport.width}px`;
    for (let index = 0; index < pdf!._pdfInfo.numPages; index++) {
      pages.push(
        <Page
          pdf={pdf!}
          pageNumber={index + 1}
          // observer={io.current}
          scale={props.scale}
          defaultHeight={viewport.height}
          defaultWidth={viewport.width}
          loadContent={false}
        />
      );
    }
    setPage(pages);
  };

  useLayoutEffect(() => {
    Array.from(document.getElementsByClassName("page")).map((page) =>
      io.current?.observe(page)
    );
    return () => {
      io.current?.disconnect();
    };
  });

  // const viewerRect = document.getElementById("viewer")?.getBoundingClientRect();
  return loading ? (
    <LinearProgress />
  ) : (
    <Box>
      {/* <div
        id="viewerContainer"
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          margin: "auto",
        }}
      > */}
      <div
        id="viewer"
        className="pdfViewer"
        key={v4()}
        style={{ margin: "0 auto", ...props.style }}
        ref={PDFViewerRef}
      >
        {pdf && pages}
      </div>
      {/* </div> */}
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          left: "50%",
          bottom: 16,
          // right: viewerRect ? viewerRect.left - 70 : 16,
        }}
      >
        <TextField
          id="currentPage"
          variant="standard"
          inputProps={{ style: { textAlign: "center" } }}
          inputRef={currentPageRef}
          onKeyUp={(event) => {
            const page = Number(currentPageRef.current?.value);
            if (event.key === "Enter") {
              currentPageRef.current!.blur();
              if (page > 0 && page <= pages.length) {
                goPage(page);
              } else {
                Array.from(document.getElementsByClassName("page")).forEach(
                  (page) => {
                    if (page.getAttribute("checked") === "") {
                      currentPageRef.current!.value = page.getAttribute(
                        "data-page-number"
                      ) as string;
                    }
                  }
                );
              }
            }
          }}
          type="number"
          sx={{
            width: "36px",
            "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
            "input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        />
        <Typography>/{pages.length}</Typography>
      </Fab>
    </Box>
  );
};
export default PDFViewer;
