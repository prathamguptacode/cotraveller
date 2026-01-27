import React from 'react'
import mystyle from './dropDown.module.css'

function MinDrop({setMin}) {

    function handle(e){
        const val=e.target.innerText;
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
