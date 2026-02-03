import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import mystyle from './dropDown.module.css'

type MinDropProps = {
  setMin: Dispatch<SetStateAction<string>>
}
function MinDrop({ setMin }: MinDropProps) {

  const handle = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const val = e.currentTarget.innerText;
    setMin(val)
  }

  return (
    <div className={mystyle.minDrop}>
      <div className={mystyle.options} onClick={handle}>
        00
      </div>
      <div className={mystyle.options} onClick={handle}>
        05
      </div>
      <div className={mystyle.options} onClick={handle}>
        10
      </div>
      <div className={mystyle.options} onClick={handle}>
        15
      </div>
      <div className={mystyle.options} onClick={handle}>
        20
      </div>
      <div className={mystyle.options} onClick={handle}>
        25
      </div>
      <div className={mystyle.options} onClick={handle}>
        30
      </div>
      <div className={mystyle.options} onClick={handle}>
        35
      </div>
      <div className={mystyle.options} onClick={handle}>
        40
      </div>
      <div className={mystyle.options} onClick={handle}>
        45
      </div>
      <div className={mystyle.options} onClick={handle}>
        50
      </div>
      <div className={mystyle.options} onClick={handle}>
        55
      </div>
    </div>
  )
}

export default MinDrop
