import mystyle from './Statusbar.module.css';
import clsx from 'clsx';

function Statusbar({ currentStep }: { currentStep: number }) {

  return (
    <div className={mystyle.statusbar}>
      <div
        className={clsx(
          mystyle.dot,
          currentStep >= 0 ? null : mystyle.inactive,
          currentStep === 0 ? mystyle.active : null,
        )}
      >
        1
      </div>
      <span className={clsx(currentStep >= 0 ? null : mystyle.textInactive)}>Basic Info</span>
      <div
        className={clsx(
          mystyle.line,
          currentStep > 0 ? null : mystyle.inactive,
        )}
      ></div>
      <div
        className={clsx(
          mystyle.dot,
          currentStep >= 1 ? null : mystyle.inactive,
          currentStep === 1 ? mystyle.active : null,
        )}
      >
        2
      </div>
      <span className={clsx(currentStep >= 1 ? null : mystyle.textInactive)}>Travel details</span>
      <div
        className={clsx(
          mystyle.line,
          currentStep > 1 ? null : mystyle.inactive,
        )}
      ></div>
      <div
        className={clsx(
          mystyle.dot,
          currentStep >= 2 ? null : mystyle.inactive,
          currentStep === 2 ? mystyle.active : null,
        )}
      >
        3
      </div>
      <span className={clsx(currentStep >= 2 ? null : mystyle.textInactive)}>Review</span>
    </div>
  );
}

export default Statusbar;
