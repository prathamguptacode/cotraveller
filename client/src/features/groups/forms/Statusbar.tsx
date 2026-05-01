import mystyle from '../groupForm.module.css';
import clsx from 'clsx';

type StatusbarProps = {
  currentStep: number,
  handleNext: () => void,
  handleBack: (backToStep?: number) => void
}

function Statusbar({ currentStep, handleBack, handleNext }: StatusbarProps) {

  const stepNames = ['Basic Info', 'Travel Details', 'Review'] as const



  return (
    <div className={mystyle.statusbar}>
      {stepNames.map((step, i) => {
        return (
          <StepIndicator stepName={step} currentStep={currentStep} forStep={i} handleBack={handleBack} handleNext={handleNext} key={i} />
        )
      })}

    </div>
  );
}

export default Statusbar;

type StepIndicatorProps = {
  forStep: number,
  currentStep: number,
  handleNext: () => void,
  handleBack: (backToStep?: number) => void,
  stepName: string
}

const StepIndicator = ({ forStep, currentStep, handleBack, handleNext, stepName }: StepIndicatorProps) => {

  const handleSwitchStep = () => {
    if (forStep > currentStep) return handleNext()
    if (forStep < currentStep) return handleBack(forStep)
  }

  return (
    <>
      <button onClick={handleSwitchStep} className={clsx(mystyle.dot, currentStep < forStep && mystyle.inactive, currentStep == forStep && mystyle.active)}>
        {forStep + 1}
      </button>
      <span className={mystyle.stepName}>{stepName}</span>
      <div className={clsx(mystyle.line, currentStep <= forStep && mystyle.inactive)}></div>
    </>

  )

}