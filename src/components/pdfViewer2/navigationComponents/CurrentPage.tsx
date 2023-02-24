import { Fab, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { usePDFContext } from "../usePDFContext";

export const goPage = (i: number) => {
  const targetPage = document.getElementById(
    `pageContainer${i}`
  ) as HTMLDivElement | null;
  targetPage?.scrollIntoView({ behavior: "auto" });
};

const CurrentPage = () => {
  const { pdf, scale, loading } = usePDFContext();
  const totalPages = pdf?.numPages;
  const currentPageRef = useRef<HTMLInputElement>(null);
  const [firstpage, setFirstPage] = useState<HTMLDivElement | null>(null);
  const [left, setLeft] = useState<number | string | null>("50%");
  const getLeft: () => void = () => {
    const _viewer = document.getElementById("viewer");
    _viewer && setLeft(_viewer.offsetLeft + _viewer.offsetWidth * 0.5);
  };

  useEffect(() => {
    const scaleRate = (1 / scale) * 0.5;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          if (item.intersectionRatio > scaleRate) {
            if (currentPageRef.current) {
              currentPageRef.current!.value =
                item.target.getAttribute("data-page-number")!;
            }
          }
        });
      },
      {
        threshold: [0.5],
      }
    );
    Array.from(document.getElementsByClassName("page")).map((page) =>
      observer.observe(page)
    );
    return () => {
      observer.disconnect();
    };
  });
  useEffect(() => {
    return () => {
      const _page = document.querySelector(".page") as HTMLDivElement | null;
      setFirstPage(_page);
      _page && getLeft();
    };
  });

  useEffect(() => {
    window.addEventListener("resize", getLeft);
    return () => {
      window.removeEventListener("resize", getLeft);
    };
  }, []);

  return !loading && totalPages && firstpage ? (
    <Fab
      variant="extended"
      sx={{
        position: "fixed",
        left: left,
        bottom: 16,
      }}
    >
      <TextField
        id="currentPage"
        variant="standard"
        inputProps={{ style: { textAlign: "center" } }}
        inputRef={currentPageRef}
        defaultValue={0}
        onClick={(event) => {
          const page = Number(currentPageRef.current!.value);
          if (page > 0 && page <= totalPages) {
            currentPageRef.current?.setAttribute("prePage", `${page}`);
          }
        }}
        onKeyUp={(event) => {
          const page = Number(currentPageRef.current?.value);
          if (event.key === "Enter") {
            currentPageRef.current!.blur();
            if (page > 0 && page <= totalPages) {
              goPage(page);
            } else {
              currentPageRef.current!.value =
                currentPageRef.current?.getAttribute("prePage")!;
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
      <Typography>/{totalPages}</Typography>
    </Fab>
  ) : null;
};

export default CurrentPage;
