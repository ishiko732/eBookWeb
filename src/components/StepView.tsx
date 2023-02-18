import React from "react";
import { DefaultTFuncReturn, TFunction } from "i18next";
import StepContent from "@mui/material/StepContent";
import {
  Box,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Loading } from "./Loading";

export interface stepContent {
  label: string | DefaultTFuncReturn;
  time?: string | DefaultTFuncReturn;
  op?: JSX.Element;
  description?: string | DefaultTFuncReturn;
}

export const StepView = ({
  t,
  content,
  error_finish,
  firstStep,
  handleSubmit,
  submit_error,
  only_read,
}: {
  t: TFunction<"translation", undefined, "translation">;
  content: stepContent[];
  error_finish?: boolean;
  firstStep: number;
  handleSubmit: (submit: boolean) => void;
  submit_error: boolean;
  only_read?: true;
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const newActiveStep = prevActiveStep + 1;
      if (newActiveStep === content.length) {
        handleSubmit(true);
      }
      return newActiveStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(content.length > firstStep ? firstStep : 0);
  };

  React.useEffect(() => {
    if (content.length > 0) {
      setActiveStep(content.length >= firstStep ? firstStep : 0);
    }
    // eslint-disable-next-line
  }, [content.length]);

  return content.length === 0 ? (
    <Loading />
  ) : (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ margin: "0 auto" }}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {content.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                step.time ? (
                  <Typography variant="caption">{step.time}</Typography>
                ) : index + 1 === content.length ? (
                  <Typography variant="caption">
                    {t("management.review.viewReview.LastStep")}
                  </Typography>
                ) : null
              }
              error={index - 1 === content.length && error_finish}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {step.description ? (
                <Typography>{step.description}</Typography>
              ) : null}
              {step.op || null}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={
                      only_read ||
                      (index + 1 === content.length && submit_error)
                    }
                  >
                    {index + 1 === content.length
                      ? t("management.review.viewReview.Finish")
                      : t("management.review.viewReview.Continue")}
                  </Button>
                  <Button
                    disabled={only_read || index <= firstStep}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {t("management.review.viewReview.BACK")}
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === content.length && (
        <Stack
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <Typography>{t("management.review.viewReview.completed")}</Typography>
          <Button onClick={handleReset} variant="outlined" disabled={only_read}>
            <Typography>{t("management.review.viewReview.RESET")}</Typography>
          </Button>
        </Stack>
      )}
    </Grid>
  );
};
