import { Stack, SvgIcon, Typography } from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { file, topic } from "../../api/models";
import { queryTopics } from "../../api/note";
import { Loading } from "../../components/Loading";
import { useReadContext } from "./ReadContext";
import VditorEdit from "./VditorEdit";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
export const TopicTitle = () => {
  const { topic, vd } = useReadContext();
  const [show, setShow] = useState(false);
  const handleCheck = useCallback(() => {
    if (!vd) {
      return;
    }
    if (!topic) {
      return;
    }
    setShow(topic?.data !== vd?.getValue());
  }, [vd, topic]);
  useEffect(() => {
    const check = setInterval(handleCheck, 1000);
    return () => {
      clearInterval(check);
    };
  }, [handleCheck]);
  useEffect(() => {
    handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  return (
    <Stack direction="row" spacing={0}>
      <Typography>Topic</Typography>
      {show && (
        <SvgIcon color="disabled">
          <FiberManualRecordRoundedIcon />
        </SvgIcon>
      )}
    </Stack>
  );
};

const Topic = (props: { file?: file | null }) => {
  const { file } = props;
  const { topic, setTopic } = useReadContext();
  const [vditorJSX, setVditorJSX] = useState(<Fragment></Fragment>);
  const [topics, setTopics] = useState<topic[]>([]);

  useEffect(() => {
    file &&
      queryTopics({ fileId: file?.id })
        .then((res) => {
          setTopics(res.data);
          res.data.length > 0 && setTopic(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [file]);
  useEffect(() => {
    setVditorJSX(() => {
      return topic ? (
        <VditorEdit
          style={{
            minHeight: document.body.offsetHeight * 0.3,
            maxHeight: document.body.offsetHeight * 0.6,
          }}
        />
      ) : (
        <Loading />
      );
    });
  }, [topic]);
  return <Fragment>{vditorJSX}</Fragment>;
};

export default Topic;
