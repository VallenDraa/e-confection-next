import * as React from 'react';

export function useMultistepForm(steps: React.ReactNode[]) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const next = React.useCallback(() => {
    setCurrentStepIndex(i => {
      const nextIdx = i + 1;

      return i === steps.length - 1 ? i : nextIdx;
    });
  }, [steps.length]);

  const back = React.useCallback(() => {
    setCurrentStepIndex(i => {
      const prevIdx = i - 1;

      return i === 0 ? i : prevIdx;
    });
  }, []);

  const goTo = React.useCallback((step: number) => {
    setCurrentStepIndex(step);
  }, []);

  return {
    currentStepIndex,
    steps,
    step: steps[currentStepIndex],
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
  };
}
