import { useEffect } from "react";
import getOutline, { viewer_outline } from "../basicFunctions/LoadOutline";
import { usePDFContext } from "../usePDFContext";

const Outline = ({
  children,
  handleOutline,
}: {
  children?: JSX.Element;
  handleOutline?: (outline: viewer_outline[]) => void;
}) => {
  const { pdf, loadedDocument, loadedOutline, setLoadedOutline } =
    usePDFContext();

  useEffect(() => {
    if (!loadedDocument) {
      return;
    }
    if (!loadedOutline && pdf) {
      setLoadedOutline(true);
      getOutline({ pdf }).then((data) => {
        handleOutline && handleOutline(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedDocument]);
  return children || null;
};
export default Outline;
