import { Box, CircularProgress } from "@mui/material";
import React, { memo } from "react";
import { useSearchParams } from "react-router-dom";
import PDFViewer from "../../components/pdfViewer";
import { BaseURL } from "../../config/config";
import { access_token as access_string } from "../../config/token";

export const generateURL = (resourceId: string) => {
  return `${BaseURL}file/views/${resourceId}`;
};

export const documentInitParameters = (pdfURL: string) => {
  return {
    url: pdfURL,
    disableAutoFetch: false,
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
      <PDFViewer
        documentInitParameters={documentInitParameters(generateURL(resourceId))}
        scale={DEFAULT_SCALE}
        // style={{
        //   width: '50vw',
        //   paddingLeft: 300
        // }}
      />
    </Box>
  ) : (
    <CircularProgress style={{ margin: "0 auto" }} />
  );
});

export default PDFBrowse;
