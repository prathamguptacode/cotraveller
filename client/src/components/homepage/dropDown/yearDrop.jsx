import React from 'react'
import mystyle from '../homepage.module.css'

function YearDrop({setYear}) {

    function handle(e){
        const val=e.target.innerText;
        setYear(val)
    }

  return (
    <div className={mystyle.yearDrop}>
        <div className={mystyle.options} onClick={handle}>2025</div>
        <div className={mystyle.options} onClick={handle}>2026</div>
        <div className={mystyle.options} onClick={handle}>2027</div>
        <div className={mystyle.options} onClick={handle}>2028</div>
        <div className={mystyle.options} onClick={handle}>2029</div>
        <div className={mystyle.options} onClick={handle}>2030</div>
        <div className={mystyle.options} onClick={handle}>2031</div>
        <div className={mystyle.options} onClick={handle}>2032</div>
        <div className={mystyle.options} onClick={handle}>2033</div>
        <div className={mystyle.options} onClick={handle}>2034</div>
        <div className={mystyle.options} onClick={handle}>2035</div>
    </div>
  )
}

export default YearDrop
