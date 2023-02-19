import { Box } from "@mui/material";
import React, { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { Document, Pages } from "../../components/pdfViewer2";
import { CurrentPage } from "../../components/pdfViewer2/navigationComponents";
import { BaseURL } from "../../config/config";
import { access_token as access_string } from "../../config/token";

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

const DEFAULT_SCALE = 1.33;
const PDFBrowse: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const resourceId = searchParams.get("resource");

  return resourceId ? (
    <Box>
      <Document
        option={documentInitParameters(generateURL(resourceId))}
        scale={DEFAULT_SCALE}
      >
        <Pages />
        <CurrentPage />
      </Document>
    </Box>
  ) : (
    <div>Error 404</div>
  );
});

export default PDFBrowse;
