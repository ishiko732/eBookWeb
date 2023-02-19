import { Fab, TextField, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { usePDFContext } from "../usePDFContext";

export const goPage = (i: number) => {
  const targetPage = document.getElementById(
    `pageContainer${i}`
  ) as HTMLDivElement;
  targetPage.scrollIntoView({ behavior: "auto" });
};

const CurrentPage = () => {
  const { pdf, scale } = usePDFContext();
  const totalPages = pdf?.numPages;
  const currentPageRef = useRef<HTMLInputElement>(null);
  const scaleRate = (1 / scale) * 0.5;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          if (item.intersectionRatio > scaleRate) {
            (item.target as HTMLDivElement).setAttribute("checked", "");
            Array.from(document.getElementsByClassName("page"))
              .filter((page) => page !== item.target)
              .map((page) => page.removeAttribute("checked"));
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
  return totalPages ? (
    <Fab
      variant="extended"
      sx={{
        position: "fixed",
        left: "50%",
        bottom: 16,
      }}
    >
      <TextField
        id="currentPage"
        variant="standard"
        inputProps={{ style: { textAlign: "center" } }}
        inputRef={currentPageRef}
        defaultValue={0}
        onKeyUp={(event) => {
          const page = Number(currentPageRef.current?.value);
          if (event.key === "Enter") {
            currentPageRef.current!.blur();
            if (page > 0 && page <= totalPages) {
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
      <Typography>/{totalPages}</Typography>
    </Fab>
  ) : null;
};

export default CurrentPage;
