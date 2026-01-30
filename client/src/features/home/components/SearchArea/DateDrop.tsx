import React, { useMemo } from 'react'
import mystyle from './search.module.css'


type DateDropProps = {
  setDate: React.Dispatch<React.SetStateAction<string>>
}

function DateDrop({ setDate }: DateDropProps) {

  const dates = useMemo(() => {
    const array: string[] = []
    for (let i = 1; i <= 31; i++) {
      array.push(i.toString().padStart(2, '0'))
    }
    return array
  }, [])

  function handle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const val = e.currentTarget.innerText
    setDate(val)
  }

  return (
    <div className={mystyle.dateDrop}>
      {dates.map(date => {
        return (
          <div key={date} className={mystyle.options} onClick={handle}>{date}</div>
        )
      })}
    </div>
  )
}

export default DateDrop
