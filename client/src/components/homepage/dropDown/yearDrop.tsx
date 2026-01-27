import React from 'react'
import mystyle from '../homepage.module.css'
import { Years, type Year } from '@/types/constants.types';

type YearDropProps = {
  setYear: React.Dispatch<React.SetStateAction<Year>>
}

function YearDrop({ setYear }: YearDropProps) {

  function handle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const val = e.currentTarget.innerText as Year
    setYear(val)
  }

  return (
    <div className={mystyle.yearDrop}>
      {Years.map(year => {
        return (
          <div className={mystyle.options} onClick={handle}>{year}</div>
        )
      })}

    </div>
  )
}

export default YearDrop
