import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  // color: theme.palette.text.secondary,
}));

export interface AccordionItem {
  title: string;
  details: string | JSX.Element;
  defaultExpanded?:boolean
}

export default function AccordionItems({ items}: { items: AccordionItem[]}) {
  return (
    <Stack sx={{ width: "18rem", minHeight: 377 }} spacing={2}>
      {items.map((item, index: number) => (
        <Paper key={`AccordionItem-${index}`}>
          <StyledAccordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{item.details}</AccordionDetails>
          </StyledAccordion>
        </Paper>
      ))}
    </Stack>
  );
}
