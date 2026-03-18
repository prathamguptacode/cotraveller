import './accessibility.css'


type ToolTipProps = {
    text: string,
    position?: 'right' | 'bottom' | 'left'
}

export const ToolTip = ({ text, position = 'right' }: ToolTipProps) => {
    return (
        <span className='tooltip' style={{
            left: position === 'right' ? '110%' : '',
            top: position === 'bottom' ? '130%' : '',
            right: position === 'left' ? '110%' : '',
        }}>
            {text}
        </span>
    )
}