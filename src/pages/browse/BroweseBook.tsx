import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { shareBook } from "../../api/models";
import { viewPDFImageURL } from "../../api/file";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import {
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import { addbrowse, addLove, copyBookToUser } from "../../api/share";
import Search from "../../components/search-bar/search";
import { useSwipeableDrawerContext } from "../../components/PositionSwipeableDrawer";
import { BookContent } from "../../components/BookContent";
import { CommentContent } from "../../components/comment-view";
import { queryBook } from "./query";
import { useUserContext } from "../../UserContext";

const DrawerContent = ({
  item,
  sStore,
}: {
  item: shareBook;
  sStore?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setWidth } = useSwipeableDrawerContext();
  setWidth(document.body.clientWidth * 0.65);
  return (
    <React.Fragment>
      <Stack
        direction={{ xs: "column", sm: "column" }}
        spacing={{ xs: 1, sm: 2, md: 4, pt: 8 }}
        divider={<Divider flexItem />}
        justifyContent="center"
        alignItems="center"
      >
        <BookContent item={item} sStore={sStore} />

        <CommentContent item={item} />
      </Stack>
    </React.Fragment>
  );
};

const MediaItem = ({ item }: { item: shareBook }) => {
  const [loadingContext, setLoadingContext] = React.useState(true);
  const [loveStatus, setLove] = React.useState(item.loveForDay);
  const [loveCnt, setLoveCnt] = React.useState(item.love);
  const [store, setStore] = React.useState(item.store);
  const [browse, setBrowse] = React.useState(item.browse);
  const isBrowse = React.useRef(item.browseFor4Hour);
  const { setOpen, setDrawerContent } = useSwipeableDrawerContext();
  const handleLoveClick = () => {
    setLoveCnt((pre) => (loveStatus ? pre - 1 : pre + 1));
    setLove((pre) => !pre);
    addLove(item.book.id).catch(() => {
      setLoveCnt((pre) => (loveStatus ? pre - 1 : pre + 1));
      setLove((pre) => !pre);
    });
  };
  const handleStoreClick = () => {
    if (!store) {
      setStore((pre) => !pre);
      copyBookToUser(item.book.id, item.file.id, item.file.fsId).catch(() => {
        setStore((pre) => !pre);
      });
    }
  };
  return (
    <Box
      key={item.book.mid + item.file.md5}
      sx={{ width: 210, marginRight: 4, my: 5 }}
    >
      {(loadingContext || !item) && (
        <Skeleton
          style={{ position: "absolute" }}
          width={210}
          height={210}
          animation="wave"
          variant="rectangular"
        />
      )}
      <img
        style={{ width: 210, height: 210 }}
        alt={item.book.title || item.file.filename}
        src={viewPDFImageURL(item.file.fsId)}
        onLoad={() => setLoadingContext(false)}
        onClick={() => {
          setDrawerContent(
            <DrawerContent
              item={{
                ...item,
                love: loveCnt,
                store: store,
              }}
              sStore={setStore}
            />
          );
          if (!isBrowse.current) {
            addbrowse(item.book.id).then((res) => {
              setBrowse((pre) => pre + 1);
              isBrowse.current = !isBrowse.current;
            });
          }
          setOpen(true);
        }}
      />
      <Stack justifyContent="space-between" direction="row">
        <Box sx={{ pr: 1 }}>
          <Typography gutterBottom variant="body2">
            {item.book.title}
          </Typography>
          <Chip
            size="small"
            icon={loveStatus ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            variant={loveStatus ? "filled" : "outlined"}
            label={loveCnt}
            sx={{ marginRight: 2 }}
            color="error"
            onClick={handleLoveClick}
          />
          <Chip
            size="small"
            color="info"
            icon={<AutoStoriesIcon />}
            label={browse}
          />
        </Box>
        {
          <IconButton
            color="info"
            size="large"
            sx={{ marginRight: 2 }}
            disabled={store}
            onClick={handleStoreClick}
          >
            {item.store ? (
              <LibraryAddCheckOutlinedIcon />
            ) : (
              <LibraryAddOutlinedIcon />
            )}
          </IconButton>
        }
      </Stack>
    </Box>
  );
};

function Media(props: { books: shareBook[] }) {
  const { books } = props;
  const { setPostion } = useSwipeableDrawerContext();
  setPostion("right");

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {books.map((item) => {
        return <MediaItem item={item} />;
      })}
    </Grid>
  );
}

export default function BroweseBook(props: { books: shareBook[] }) {
  const [query, setQuery] = React.useState("");
  const [queryBooks, setBooks] = React.useState<shareBook[] | null>(null);
  const { t } = useUserContext();

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(event.key);
    if (event.key === "Enter") {
      setBooks(queryBook(props.books, query));
    }
  };
  React.useEffect(() => {
    if (query === "") {
      setBooks(null);
    }
  }, [query]);

  return (
    <Box sx={{ overflow: "hidden" }} mt={2}>
      {props.books.length > 0 ? (
        <React.Fragment>
          <Stack direction="row" justifyContent="space-between" spacing={0}>
            <Search
              value={query}
              setValue={setQuery}
              handleKeyUp={handleKeyUp}
              placeholder={t("TreeView.search") || undefined}
            />
          </Stack>
          <Divider />
          <Media books={queryBooks || props.books} />
        </React.Fragment>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
