import "vditor/dist/index.css";
import React from "react";
import Vditor from "vditor";
import { Stack } from "@mui/material";

const VditorEdit = (props: { style?: React.CSSProperties }) => {
  const [vd, setVd] = React.useState<Vditor>();
  React.useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue("`Vditor` 最小代码示例");
        setVd(vditor);
      },
    });
  }, []);
  return <div id="vditor" className="vditor" style={props.style} />;
};

export default VditorEdit;
