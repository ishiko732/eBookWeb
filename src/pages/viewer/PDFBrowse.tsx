import { Box } from "@mui/material";
import React, { memo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Document, Pages } from "../../components/pdfViewer2";
import { UploadImage } from "../../components/pdfViewer2/basicFunctions/UploadImage";
import { CurrentPage } from "../../components/pdfViewer2/navigationComponents";
import { BaseURL } from "../../config/config";
import { access_token as access_string } from "../../config/token";
import useLocalStorage from "../../config/useLocalStorage";
export const generateURL = (resourceId: string) => {
  return `${BaseURL}file/views/${resourceId}`;
};

export const documentInitParameters = (pdfURL: string) => {
  return {
    url: pdfURL,
    disableAutoFetch: true,
    disableRange: true,
    cMapUrl: "pdfjs-dist/cmaps/",
    cMapPacked: true,
    enableXfa: true,
    httpHeaders: {
      "Accept-Encoding": "Identity",
      Authorization: `Bearer ${localStorage.getItem(access_string)}`,
    },
    withCredentials: true,
  };
};

export const DEFAULT_SCALE = 1.33;
const PDFBrowse: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const resourceId = searchParams.get("resource");
  const scale = searchParams.get("scale");
  const [localScale] = useLocalStorage("scale", DEFAULT_SCALE, Number(scale));
  const navigate = useNavigate();
  if (!resourceId) {
    navigate("/exception/404", { replace: true });
  }
  if (!scale) {
    setSearchParams({
      resource: resourceId as string,
      scale: `${localScale}`,
    });
  }
  return resourceId ? (
    <div id="PDFViwer">
      <Box>
        <Document
          option={documentInitParameters(generateURL(resourceId))}
          scale={Number(localScale)}
        >
          <Pages />
          <CurrentPage />
          <UploadImage />
        </Document>
      </Box>
    </div>
  ) : (
    <div>Error 404</div>
  );
});

export default PDFBrowse;
