import {
  Divider,
  InputBaseComponentProps,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createCard, FSRS } from "../../algorithm/fsrs/fsrs";
import {
  generatorParameters,
  Parameters,
  Rating,
  SchedulingLog,
  State,
  Card,
  ReviewLog,
} from "../../algorithm/fsrs/models";
import { useSwipeableDrawerContext } from "../../components/PositionSwipeableDrawer";
import Title from "../../components/Title";
import { useReadContext } from "../../ReadContext";
import { useUserContext } from "../../UserContext";
import { TFunction } from "i18next";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import dayjs from "dayjs";

interface configField {
  label: string;
  value: string | number | boolean;
  type?: string;
  handleChangle: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  message?: string;
  props?: InputBaseComponentProps | undefined;
}

interface example {
  card: Card;
  log: ReviewLog;
}

const FSRSConfig = () => {
  const { setWidth } = useSwipeableDrawerContext();
  setWidth(document.body.clientWidth * 0.7);
  const { t } = useUserContext();
  const { parameter } = useReadContext();
  const [request_retention, set_request_retention] = useState<number>(0.9);
  const [maximum_interval, set_maximum_interval] = useState<number>(36500);
  const [easy_bonus, set_easy_bonus] = useState<number>(1.3);
  const [hard_factor, set_hard_factor] = useState<number>(1.2);
  const [w, set_w] = useState<number[]>([]);
  const [enable_fuzz, set_enable_fuzz] = useState(false);
  const [example1, setExample1] = useState<example[]>([]);
  const [example2, setExample2] = useState<example[]>([]);
  const [example3, setExample3] = useState<example[]>([]);
  const [example4, setExample4] = useState<example[]>([]);

  const handleSet = (fsrsParameter: Parameters) => {
    set_request_retention(fsrsParameter.request_retention);
    set_maximum_interval(fsrsParameter.maximum_interval);
    set_easy_bonus(fsrsParameter.easy_bonus);
    set_hard_factor(fsrsParameter.hard_factor);
    set_w(fsrsParameter.w);
    set_enable_fuzz(fsrsParameter.enable_fuzz);
  };
  //   useEffect(()=>{
  //     const fsrsParameter = generatorParameters({
  //         request_retention:request_retention,
  //         maximum_interval:maximum_interval,
  //         easy_bonus:easy_bonus,
  //         hard_factor:hard_factor,
  //         w:w,
  //         enable_fuzz:enable_fuzz
  //     });
  //     handleSet(fsrsParameter);
  //     setExample1( generatorExample1(fsrsParameter))

  //   },[easy_bonus, enable_fuzz, hard_factor, maximum_interval, request_retention, w])

  useEffect(() => {
    const fsrsParameter = generatorParameters({ ...parameter });
    handleSet(fsrsParameter);
    setExample1(generatorExample1(fsrsParameter));
  }, [parameter]);

  const generatorExample1 = (fsrsParameter: Parameters): example[] => {
    // new -> again -> hard->good->easy->easy->again->good->hard
    const fsrs = new FSRS(fsrsParameter);
    const newCard = createCard();
    let card = newCard;
    let now = dayjs();
    let scheduling_cards = fsrs.repeat(card, now);
    const again = scheduling_cards[Rating.Again];

    card = again.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const hard = scheduling_cards[Rating.Hard];

    card = hard.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const good = scheduling_cards[Rating.Good];

    card = good.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const easy1 = scheduling_cards[Rating.Easy];

    card = easy1.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const easy2 = scheduling_cards[Rating.Easy];

    card = easy2.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const again2 = scheduling_cards[Rating.Again];

    card = again2.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const good2 = scheduling_cards[Rating.Good];

    card = good2.card;
    now = card.due;
    scheduling_cards = fsrs.repeat(card, now);
    const hard2 = scheduling_cards[Rating.Hard];

    const data = [again, hard, good, easy1, easy2, again2, good2, hard2];
    return data;
  };

  const ConfigFields: configField[] = [
    {
      label: t("fsrs.request_retention"),
      value: request_retention,
      type: "number",
      handleChangle: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        set_request_retention(Number(event.target.value));
      },
      message: t("fsrs.request_retention_full") as string,
      props: {
        step: "0.1",
        max: 1,
        min: 0,
      },
    },
    {
      label: t("fsrs.easy_bonus"),
      value: easy_bonus,
      type: "number",
      handleChangle: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        set_easy_bonus(Number(event.target.value));
      },
      message: t("fsrs.easy_bonus_full") as string,
      props: {
        step: "0.1",
        min: 0,
      },
    },
    {
      label: t("fsrs.hard_factor"),
      value: hard_factor,
      type: "number",
      handleChangle: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        set_hard_factor(Number(event.target.value));
      },
      message: t("fsrs.hard_factor_full") as string,
      props: {
        step: "0.1",
        min: 0,
      },
    },
    {
      label: t("fsrs.maximum_interval"),
      value: maximum_interval,
      type: "number",
      handleChangle: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        set_maximum_interval(Number(event.target.value));
      },
      message: t("fsrs.maximum_interval_full") as string,
    },
    {
      label: t("fsrs.w"),
      value: `[${w}]`,
      type: "text",
      handleChangle: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        const new_w = event.target.value
          .replaceAll("，", ",")
          .replaceAll("[", "")
          .replaceAll("]", "")
          .split(",")
          .map((v) => Number(v));
        set_w(new_w);
      },
      message: t("fsrs.w_full") as string,
    },
  ];

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
      padding="16px"
    >
      <FSRSParameterConfig
        t={t}
        enable_fuzz={enable_fuzz}
        set_enable_fuzz={set_enable_fuzz}
        ConfigFields={ConfigFields}
      />
      <Paper elevation={0} sx={{ width: "70%" }}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          // width="60%"
          spacing={4}
        >
          <Title>Example1</Title>
          <CustomizedSteppers example={example1} />
          <Title>Example2</Title>
          <CustomizedSteppers example={example1} />
          <Title>Example3</Title>
          <CustomizedSteppers example={example1} />
          <Title>Example4</Title>
          <CustomizedSteppers example={example1} />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default FSRSConfig;

const FSRSParameterConfig = ({
  t,
  enable_fuzz,
  set_enable_fuzz,
  ConfigFields,
}: {
  t: TFunction<"translation", undefined, "translation">;
  enable_fuzz: boolean;
  set_enable_fuzz: React.Dispatch<React.SetStateAction<boolean>>;
  ConfigFields: configField[];
}) => {
  return (
    <Paper elevation={0} sx={{ width: "30%" }}>
      <Title>{t("fsrs.config")}</Title>
      <Stack direction="column" spacing={2}>
        {ConfigFields.map((field) => (
          <TextField
            type={field.type}
            label={field.label}
            variant="standard"
            inputProps={field.props}
            value={field.value}
            onChange={field.handleChangle}
            helperText={field.message}
          />
        ))}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          color={"rgba(0, 0, 0, 0.6)"}
        >
          <Typography variant="body2">{t("fsrs.enable_fuzz")}</Typography>
          <Typography variant="body2">{t("fsrs.off")}</Typography>
          <Switch
            checked={enable_fuzz}
            onClick={() => set_enable_fuzz((pre) => !pre)}
          />
          <Typography variant="body2">{t("fsrs.on")}</Typography>
        </Stack>
        <Typography variant="caption" color={"rgba(0, 0, 0, 0.6)"}>
          {t("fsrs.enable_fuzz_full")}
        </Typography>
      </Stack>
    </Paper>
  );
};

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { className } = props;
  return (
    <QontoStepIconRoot ownerState={{ active: true }} className={className}>
      <div className="QontoStepIcon-circle" />
    </QontoStepIconRoot>
  );
}

function CustomizedSteppers({ example }: { example: example[] }) {
  console.log(example);
  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={example.length + 1}
        connector={<QontoConnector />}
      >
        {example.map((step, index) => {
          return (
            <Step key={`${index}-${State[step.log.state]}`}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                optional={Rating[step.log.rating]}
              >
                {step.card.due.diff(step.card.last_review, "day") !== 0
                  ? step.card.due.diff(step.card.last_review, "day") + `day`
                  : step.card.due.diff(step.card.last_review, "minute") + "min"}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Stack>
  );
}
