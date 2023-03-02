import {
  Stack,
  SvgIcon,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { file, topic } from "../../api/models";
import { createTopic, queryTopics, updateTopic } from "../../api/note";
import { Loading } from "../../components/Loading";
import { useReadContext } from "./ReadContext";
import VditorEdit from "./VditorTopicEdit";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
export const TopicTitle = () => {
  const { topics, topicIndex, vd } = useReadContext();
  const [show, setShow] = useState(false);
  const handleCheck = useCallback(() => {
    if (topics.length <= topicIndex || !vd) {
      setShow(false);
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
  const { topics, setTopics, setTopicIndex, topicIndex, vd, setNotes } =
    useReadContext();
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
          setTopics(
            (res.data as topic[]).sort((a, b) => a.createdAt - b.createdAt)
          );
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
      {file && (
        <Tabs
          value={topicIndex}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {topics.map((item, index) => (
            <Tab
              value={index}
              label={
                <span>
                  {item.name || ""}
                  <IconButton
                    size="small"
                    component="span"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setTopics((pre) => {
                        setTopicIndex(index - 1 > 0 ? index - 1 : 0);
                        return pre.filter((node) => node !== item);
                      });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </span>
              }
            />
          ))}
          <ButtonInTabs
            onClick={() => {
              vd &&
                updateTopic({
                  ...topics[topicIndex],
                  // @ts-ignore
                  name: undefined,
                  data: vd.getValue(),
                })
                  .then((res) => {
                    setTopics((pre) => {
                      const data = [...pre];
                      data[topicIndex] = res.data;
                      return data;
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              vd &&
                createTopic({
                  fileId: file.id,
                  name: `${t("topic.default")}-${topics.length + 1}`,
                }).then((res) => {
                  setTopics((pre) => {
                    const newdata = [...pre];
                    newdata.push(res.data);
                    return newdata;
                  });
                });
            }}
          >
            <AddIcon color="secondary" />
          </ButtonInTabs>
        </Tabs>
      )}
      {topics.length > 0 && vditorJSX}
    </Fragment>
  );
};

export default Topic;

const ButtonInTabs = ({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
}) => {
  return <Button className={className} onClick={onClick} children={children} />;
};
