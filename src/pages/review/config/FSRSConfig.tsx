import {
  Button,
  Divider,
  InputBaseComponentProps,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  generatorParameters,
  Parameters,
  Rating,
  State,
} from "../../../algorithm/fsrs/models";
import { useSwipeableDrawerContext } from "../../../components/PositionSwipeableDrawer";
import Title from "../../../components/Title";
import { useReadContext } from "../../../ReadContext";
import { useUserContext } from "../../../UserContext";
import { TFunction } from "i18next";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import {
  example,
  generatorExample1,
  generatorExample2,
  generatorExample3,
  generatorExample4,
} from "../../../algorithm/fsrs/example";
import { FSRS_Version } from "../../../algorithm/fsrs";
import { updateParameter } from "../../../api/fsrs";

interface configField {
  label: string;
  value: string | number | boolean;
  type?: string;
  handleChangle: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  message?: string;
  props?: InputBaseComponentProps | undefined;
  error?: boolean;
}

const FSRSConfig = () => {
  const { setWidth, setOpen, open } = useSwipeableDrawerContext();
  setWidth(document.body.clientWidth * 0.7);
  const { t } = useUserContext();
  const { parameter, setParameter } = useReadContext();
  const { user } = useUserContext();
  const [request_retention, set_request_retention] = useState<number>(0.9);
  const [maximum_interval, set_maximum_interval] = useState<number>(36500);
  const [easy_bonus, set_easy_bonus] = useState<number>(1.3);
  const [hard_factor, set_hard_factor] = useState<number>(1.2);
  const [w, set_w] = useState<number[]>([]);
  const [w_text, set_w_text] = useState("");
  const [w_error, set_w_error] = useState(false);
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
    set_w_text(`[${fsrsParameter.w.join(",")}]`);
    set_w_error(false);
    set_enable_fuzz(fsrsParameter.enable_fuzz);
    setExample1(generatorExample1(fsrsParameter));
    setExample2(generatorExample2(fsrsParameter));
    setExample3(generatorExample3(fsrsParameter));
    setExample4(generatorExample4(fsrsParameter));
  };
  useEffect(() => {
    const fsrsParameter = generatorParameters({
      request_retention: request_retention,
      maximum_interval: maximum_interval,
      easy_bonus: easy_bonus,
      hard_factor: hard_factor,
      w: w,
      enable_fuzz: enable_fuzz,
    });
    handleSet(fsrsParameter);
  }, [
    easy_bonus,
    enable_fuzz,
    hard_factor,
    maximum_interval,
    request_retention,
    w,
  ]);

  useEffect(() => {
    if (!open) return;
    const fsrsParameter = generatorParameters({ ...parameter });
    handleSet(fsrsParameter);
  }, [parameter, open]);

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
        step: "0.01",
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
      value: w_text,
      type: "text",
      handleChangle: (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        set_w_text(event.target.value);
        const new_w = event.target.value
          .replaceAll("，", ",")
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll(";", "")
          .split(",")
          .map((v) => Number(v));
        if (new_w.length === 13) {
          set_w(new_w);
          set_w_error(false);
        } else {
          set_w_error(true);
        }
      },
      message: t("fsrs.w_full") as string,
      error: w_error,
    },
  ];

  const handleButton = (op: "Reset" | "Cancel" | "Save") => {
    switch (op) {
      case "Reset":
        setParameter({
          uid: user.id,
          ...generatorParameters(),
          createdAt: 0,
          updateAt: 0,
        });
        break;
      case "Cancel":
        setOpen(false);
        break;
      case "Save":
        const fsrsParameter = generatorParameters({
          request_retention: request_retention,
          maximum_interval: maximum_interval,
          easy_bonus: easy_bonus,
          hard_factor: hard_factor,
          w: w,
          enable_fuzz: enable_fuzz,
        });
        updateParameter({
          uid: user.id,
          ...fsrsParameter,
          createdAt: 0,
          updateAt: 0,
        })
          .then((res) => {
            console.log(res.data);
            setParameter(res.data);
            setOpen(false);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      default:
        break;
    }
  };
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
        handleButton={handleButton}
      />
      <Paper elevation={0} sx={{ width: "70%" }}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          {example1.length > 0 && <Title>Example1</Title>}
          <CustomizedSteppers example={example1} />
          {example2.length > 0 && <Title>Example2</Title>}
          <CustomizedSteppers example={example2} />
          {example3.length > 0 && <Title>Example3</Title>}
          <CustomizedSteppers example={example3} />
          {example4.length > 0 && <Title>Example4</Title>}
          <CustomizedSteppers example={example4} />
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
  handleButton,
}: {
  t: TFunction<"translation", undefined, "translation">;
  enable_fuzz: boolean;
  set_enable_fuzz: React.Dispatch<React.SetStateAction<boolean>>;
  ConfigFields: configField[];
  handleButton: (op: "Reset" | "Cancel" | "Save") => void;
}) => {
  return (
    <Paper elevation={0} sx={{ width: "30%" }}>
      <Title>{t("fsrs.config")}</Title>
      <Stack direction="column" spacing={1}>
        {ConfigFields.map((field) => (
          <TextField
            type={field.type}
            label={field.label}
            variant="standard"
            inputProps={field.props}
            value={field.value}
            onChange={field.handleChangle}
            helperText={field.message}
            error={field.error}
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* <Button variant="outlined">Update</Button> */}
        <Button
          variant="outlined"
          onClick={() => {
            handleButton("Cancel");
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleButton("Reset");
          }}
        >
          Rest
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleButton("Save");
          }}
        >
          SAVE
        </Button>
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
              <Tooltip
                title={
                  <div>
                    <div>{`S:${step.card.stability.toFixed(2)}`}</div>
                    <div>{`D:${step.card.difficulty.toFixed(2)}`}</div>
                    <div>{`V:${FSRS_Version}`}</div>
                  </div>
                }
              >
                <StepLabel
                  StepIconComponent={QontoStepIcon}
                  optional={Rating[step.log.rating]}
                >
                  {step.card.due.diff(step.card.last_review, "day") !== 0
                    ? step.card.due.diff(step.card.last_review, "day") + `day`
                    : step.card.due.diff(step.card.last_review, "minute") +
                      "min"}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>
    </Stack>
  );
}
