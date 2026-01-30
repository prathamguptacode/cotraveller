import React from 'react'
import mystyle from './search.module.css'

import { Months, type Month } from '@/types/constants.types';

type MonthDropProps = {
  setMonth: React.Dispatch<React.SetStateAction<Month | 'Month ?'>>
}

function MonthDrop({ setMonth }: MonthDropProps) {

  function handle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const val = e.currentTarget.innerText as Month
    setMonth(val)
  }

  return (
    <div className={mystyle.monthDrop}>
      {Months.map(month => {
        return (
          <div className={mystyle.options} onClick={handle}>{month}</div>
        )
      })}
    </div>
  )
}

export default MonthDrop
