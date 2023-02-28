import { Fragment, useEffect, useState } from "react";
import { file, topic } from "../../api/models";
import { queryTopics } from "../../api/note";
import { Loading } from "../../components/Loading";
import VditorEdit from "./VditorEdit";

const Topic = (props: { file?: file | null }) => {
  const { file } = props;
  const [vditorJSX, setVditorJSX] = useState(<Fragment></Fragment>);
  const [topics, setTopics] = useState<topic[]>([]);
  const [topic, setTopic] = useState<topic | null>();

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
          topic={topic}
          setTopic={setTopic}
        />
      ) : (
        <Loading />
      );
    });
  }, [topic]);
  return <Fragment>{vditorJSX}</Fragment>;
};

export default Topic;
