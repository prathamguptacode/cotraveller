import React from 'react'
import mystyle from '../homepage.module.css'

function MonthDrop({setMonth}) {

    function handle(e){
        const val=e.target.innerText;
        setMonth(val)
    }

  return (
    <div className={mystyle.monthDrop}>
      <div className={mystyle.options} onClick={handle}>January</div>
      <div className={mystyle.options} onClick={handle}>February</div>
      <div className={mystyle.options} onClick={handle}>March</div>
      <div className={mystyle.options} onClick={handle}>April</div>
      <div className={mystyle.options} onClick={handle}>May</div>
      <div className={mystyle.options} onClick={handle}>June</div>
      <div className={mystyle.options} onClick={handle}>July</div>
      <div className={mystyle.options} onClick={handle}>August</div>
      <div className={mystyle.options} onClick={handle}>September</div>
      <div className={mystyle.options} onClick={handle}>November</div>
      <div className={mystyle.options} onClick={handle}>December</div>
    </div>
  )
}

export default MonthDrop
