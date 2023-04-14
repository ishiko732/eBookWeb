import { Fragment } from "react";
import { reviewLog } from "../../api/models";
import { useSwipeableDrawerContext } from "../../components/PositionSwipeableDrawer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { defaultDateFormat } from "../../config/config";
import { useUserContext } from "../../UserContext";
import { Chip } from "@mui/material";

const ReviewLogContent = ({ logs }: { logs: reviewLog[] }) => {
  const { setWidth } = useSwipeableDrawerContext();
  const { t } = useUserContext();
  setWidth(document.body.clientWidth * 0.6);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">{t("card.log.review_day")}</TableCell>
            <TableCell align="center">{t("card.log.state")}</TableCell>
            <TableCell align="center">{t("card.log.rating")}</TableCell>
            <TableCell align="center">{t("card.log.scheduled_day")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={`log-${log.review}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">
                <Chip label={dayjs(log.review).format(defaultDateFormat)} />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={t(
                    `card.${(
                      log.state as unknown as string
                    ).toLocaleLowerCase()}`
                  )}
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={t(`card.Rating.${log.rating}`)}
                />
              </TableCell>
              <TableCell align="center">
                <Chip label={log.scheduled_days} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReviewLogContent;

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}
