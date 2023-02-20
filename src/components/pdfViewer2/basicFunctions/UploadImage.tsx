import { useEffect } from "react";
import { uploadPDFImage, viewPDFImage } from "../../../api/file";
import { dataUrlToFile } from "../../../utils/base64";
import { task } from "../../../utils/sleep";
import { usePDFContext } from "../usePDFContext";

export const UploadImage = () => {
  const { scale, option } = usePDFContext();
  useEffect(() => {
    const scaleRate = (1 / Number(scale)) * 0.5;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          if (item.intersectionRatio > scaleRate) {
            task(3);
            const img = (item.target as HTMLDivElement)
              .querySelector("canvas")
              ?.getAttribute("data-img");
            if (img) {
              observer.unobserve(item.target);
              observer.disconnect();
              dataUrlToFile(img, option.url.split("/").at(-1)).then((res) =>
                uploadPDFImage(res, option.url.split("/").at(-1))
              );
            }
          }
        });
      },
      {
        threshold: [0.5],
      }
    );
    const page1 = document.getElementById("pageContainer1");
    viewPDFImage(option.url.split("/").at(-1)).catch((err) => {
      console.log(err);
      page1 && observer.observe(page1);
    });
  });
  return null;
};
