import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import mystyle from './dropDown.module.css'

type HourDropProps = {
  setHour: Dispatch<SetStateAction<string>>
}
function HourDrop({ setHour }: HourDropProps) {

  function handle(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    const val = e.currentTarget.innerText;
    setHour(val)
  }

  return (
    <div className={mystyle.hourDrop}>
      <div className={mystyle.options} onClick={handle}>
        00
      </div>
      <div className={mystyle.options} onClick={handle}>
        01
      </div>
      <div className={mystyle.options} onClick={handle}>
        02
      </div>
      <div className={mystyle.options} onClick={handle}>
        03
      </div>
      <div className={mystyle.options} onClick={handle}>
        04
      </div>
      <div className={mystyle.options} onClick={handle}>
        05
      </div>
      <div className={mystyle.options} onClick={handle}>
        06
      </div>
      <div className={mystyle.options} onClick={handle}>
        07
      </div>
      <div className={mystyle.options} onClick={handle}>
        08
      </div>
      <div className={mystyle.options} onClick={handle}>
        09
      </div>
      <div className={mystyle.options} onClick={handle}>
        10
      </div>
      <div className={mystyle.options} onClick={handle}>
        11
      </div>
      <div className={mystyle.options} onClick={handle}>
        12
      </div>
      <div className={mystyle.options} onClick={handle}>
        13
      </div>
      <div className={mystyle.options} onClick={handle}>
        14
      </div>
      <div className={mystyle.options} onClick={handle}>
        15
      </div>
      <div className={mystyle.options} onClick={handle}>
        16
      </div>
      <div className={mystyle.options} onClick={handle}>
        17
      </div>
      <div className={mystyle.options} onClick={handle}>
        18
      </div>
      <div className={mystyle.options} onClick={handle}>
        19
      </div>
      <div className={mystyle.options} onClick={handle}>
        20
      </div>
      <div className={mystyle.options} onClick={handle}>
        21
      </div>
      <div className={mystyle.options} onClick={handle}>
        22
      </div>
      <div className={mystyle.options} onClick={handle}>
        23
      </div>
      <div className={mystyle.options} onClick={handle}>
        24
      </div>
    </div>
  )
}

export default HourDrop
