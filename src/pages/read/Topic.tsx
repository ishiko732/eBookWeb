import { Stack, SvgIcon, Typography, Tabs, Tab } from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { file } from "../../api/models";
import { queryTopics } from "../../api/note";
import { Loading } from "../../components/Loading";
import { useReadContext } from "./ReadContext";
import VditorEdit from "./VditorEdit";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
export const TopicTitle = () => {
  const { topics, topicIndex, vd } = useReadContext();
  const [show, setShow] = useState(false);
  const handleCheck = useCallback(() => {
    if (topics.length < topicIndex || !vd) {
      return;
    }
    setShow(topics[topicIndex]?.data !== vd?.getValue());
  }, [vd, topics, topicIndex]);
  useEffect(() => {
    const check = setInterval(handleCheck, 1000);
    return () => {
      clearInterval(check);
    };
  }, [handleCheck]);
  useEffect(() => {
    setShow(false);
  }, [topicIndex]);

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
  const { topics, setTopics, setTopicIndex, topicIndex } = useReadContext();
  const [vditorJSX, setVditorJSX] = useState(<Fragment></Fragment>);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (topics.length === 0) {
      return;
    }
    setTopicIndex(newValue);
  };
  useEffect(() => {
    file &&
      queryTopics({ fileId: file?.id })
        .then((res) => {
          setTopics(res.data);
          res.data.length > 0 && setTopicIndex(0);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [file]);
  useEffect(() => {
    setVditorJSX(() => {
      return topics.length > 0 ? (
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
  }, [topics]);

  return (
    <Fragment>
      <Tabs
        value={topicIndex}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        {topics.map((item, index) => (
          <Tab value={index} label={item.name || ""} />
        ))}
      </Tabs>

      {vditorJSX}
    </Fragment>
  );
};

export default Topic;
