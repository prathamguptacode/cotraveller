import clsx from 'clsx'
import './loaders.css'

type SpinnerProps = {
    className?: string
}

const Spinner = ({ className }: SpinnerProps) => {
    return (
        <div className={clsx('dot-spinner', `${className}`)}>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
        </div>
    )
}

export default Spinner
