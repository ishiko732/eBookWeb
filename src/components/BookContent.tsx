import { Card, CardMedia, Box, CardContent, Typography, Divider, Stack, Chip, Button } from "@mui/material";
import { AxiosProgressEvent } from "axios";
import React from "react";
import { viewPDFImageURL, downloadFile } from "../api/file";
import { shareBook } from "../api/models";
import { copyBookToUser } from "../api/share";
import { openViewWindow } from "../config/Basic";
import { useUserContext } from "../UserContext";
import { LinearProgressWithLabel } from "./file-tree/UploadFile";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DownloadIcon from "@mui/icons-material/Download";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
export const BookContent = ({
    item,
    sStore,
  }: {
    item: shareBook;
    sStore?: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const { t } = useUserContext();
    const [store, setStore] = React.useState(item.store);
    const [progress, setProgress] = React.useState(0);
  
    const handleStoreClick = () => {
      if (!store) {
        setStore((pre) => !pre);
        sStore && sStore((pre) => !pre);
        copyBookToUser(item.book.id, item.file.id, item.file.fsId).catch(() => {
          setStore((pre) => !pre);
        });
      }
    };
    const downLoadProgress = (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total) {
        setProgress(((progressEvent.loaded / progressEvent.total) * 100) | 0);
      }
    };
    return (
      <Card sx={{ width: document.body.clientWidth * 0.5, display: "flex" }}>
        <CardMedia
          component="img"
          // style={{ width: 210, height: 210 }}
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "40%",
            maxHeight: "40%",
          }}
          alt={item.book.title || item.file.filename}
          image={viewPDFImageURL(item.file.fsId)}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {item.book.title}
            </Typography>
  
            <Divider>
              <Typography variant="inherit" color="text.secondary">
                {t(`management.book.bookField.author`)}
              </Typography>
            </Divider>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {item.book.author}
            </Typography>
  
            <Divider>
              <Typography variant="inherit" color="text.secondary">
                {t(`management.book.bookField.subject`)}
              </Typography>
            </Divider>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {item.book.subject}
            </Typography>
  
            <Divider>
              <Typography variant="inherit" color="text.secondary">
                {t(`management.book.bookField.types`)}
              </Typography>
            </Divider>
            <Stack direction="row" spacing={2} m={2}>
              {item.book.types.map((type) => {
                return <Chip label={type.type} />;
              })}
            </Stack>
  
            <Divider>
              <Typography variant="inherit" color="text.secondary">
                {t(`management.book.bookField.keywords`)}
              </Typography>
            </Divider>
            <Stack direction="row" spacing={2} m={2}>
              {item.book.keywords.map((keyword) => {
                return <Chip label={keyword.keyword} />;
              })}
            </Stack>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <Button
              variant="contained"
              startIcon={<LibraryBooksIcon />}
              color="info"
              sx={{ mr: 2 }}
              onClick={() => {
                openViewWindow(item.file.fsId);
              }}
            >
              {t("read.read")}
            </Button>
            {!store && (
              <Button
                variant="contained"
                startIcon={
                  store ? (
                    <LibraryAddCheckOutlinedIcon />
                  ) : (
                    <LibraryAddOutlinedIcon />
                  )
                }
                color="info"
                sx={{ mr: 2 }}
                onClick={handleStoreClick}
                disabled={store}
              >
                {t("read.addBook")}
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              color="info"
              sx={{ mr: 2 }}
              onClick={() => {
                downloadFile(item.file.fsId, downLoadProgress);
              }}
            >
              {t("read.downloadBook")}
            </Button>
          </Box>
          {progress > 0 ? <LinearProgressWithLabel value={progress} /> : null}
        </Box>
      </Card>
    );
  };
  