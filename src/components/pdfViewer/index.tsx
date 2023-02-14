import { useEffect, useLayoutEffect, useRef, useState } from "react";
import usePDFDocument from "./Document";
import { Page } from "./Page";
import { v4 } from "uuid";
import { Box, Fab, LinearProgress, TextField, Typography } from "@mui/material";
// import DocumentInitParameters from 'pdfjs-dist/types/src/display/api';

document.addEventListener("selectionchange", () => {
  //https://stackoverflow.com/questions/48950038/how-do-i-retrieve-text-from-user-selection-in-pdf-js
  console.log(
    window.getSelection()?.toString().replace(/\r\n/g, "").replace(/\n/g, "")
  );
});
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
  const currentPageRef = useRef<HTMLInputElement>();
  const goPage = (i: number) => {
    // setCurrentPage(i);
    const targetPage = document.getElementById(
      `pageContainer${i}`
    ) as HTMLDivElement;
    targetPage.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (pdf === undefined) {
      return () => {};
    }
    createPages();
    // firstSubmitStatus.current=true
  }, [pdf]);

  const createPages = async () => {
    const pages = [];
    const loadingObserver = new IntersectionObserver(
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
    io.current = loadingObserver;
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
    Array.from(document.getElementsByClassName("page")).map((page) => {
      io.current?.observe(page);
    });
    return () => {
      io.current?.disconnect();
    };
  });
  // const viewerRect = document.getElementById("viewer")?.getBoundingClientRect();
  return loading ? (
    <LinearProgress />
  ) : (
    <Box>
      <div
        id="viewer"
        className="pdfViewer"
        key={v4()}
        style={{ margin: "0 auto", ...props.style }}
      >
        {pdf && pages}
      </div>
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
              if (page > 0 && page <= pages.length) {
                goPage(page);
              } else {
                currentPageRef.current!.blur();
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
