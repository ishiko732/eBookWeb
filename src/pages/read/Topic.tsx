import { Fragment, useEffect, useState } from "react";
import { file } from "../../api/models";
import VditorEdit from "./VditorEdit";

const Topic = (props: { file?: file | null }) => {
  const { file } = props;
  const [vditorJSX, setVditorJSX] = useState(<Fragment></Fragment>);

  useEffect(() => {
    setVditorJSX(() => {
      return file ? (
        <VditorEdit
          style={{
            minHeight: document.body.offsetHeight * 0.2,
            maxHeight: document.body.offsetHeight * 0.5,
          }}
        />
      ) : (
        <Fragment></Fragment>
      );
    });
  }, [file]);
  return <Fragment>{vditorJSX}</Fragment>;
};

export default Topic;
