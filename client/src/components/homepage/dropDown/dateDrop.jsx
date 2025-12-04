import React from 'react'
import mystyle from '../homepage.module.css'

function DateDrop({setDate}) {

    function handle(e){
        const val=e.target.innerText
        setDate(val)
    }

  return (
    <div className={mystyle.dateDrop}>
      <div className={mystyle.options}  onClick={handle} >1</div>
      <div className={mystyle.options}  onClick={handle} >2</div>
      <div className={mystyle.options}  onClick={handle} >3</div>
      <div className={mystyle.options}  onClick={handle} >4</div>
      <div className={mystyle.options}  onClick={handle} >5</div>
      <div className={mystyle.options}  onClick={handle} >6</div>
      <div className={mystyle.options}   onClick={handle} >7</div>
      <div className={mystyle.options}  onClick={handle} >8</div>
      <div className={mystyle.options}  onClick={handle} >9</div>
      <div className={mystyle.options}   onClick={handle} >10</div>
      <div className={mystyle.options}  onClick={handle} >11</div>
      <div className={mystyle.options}  onClick={handle} >12</div>
      <div className={mystyle.options}  onClick={handle} >13</div>
      <div className={mystyle.options}  onClick={handle} >14</div>
      <div className={mystyle.options}  onClick={handle} >15</div>
      <div className={mystyle.options}  onClick={handle} >16</div>
      <div className={mystyle.options}  onClick={handle} >17</div>
      <div className={mystyle.options}  onClick={handle} >18</div>
      <div className={mystyle.options}  onClick={handle} >19</div>
      <div className={mystyle.options}  onClick={handle} >20</div>
      <div className={mystyle.options}  onClick={handle} >21</div>
      <div className={mystyle.options}  onClick={handle} >22</div>
      <div className={mystyle.options}  onClick={handle} >23</div>
      <div className={mystyle.options}  onClick={handle} >24</div>
      <div className={mystyle.options}  onClick={handle} >25</div>
      <div className={mystyle.options}  onClick={handle} >26</div>
      <div className={mystyle.options}  onClick={handle} >27</div>
      <div className={mystyle.options}  onClick={handle} >28</div>
      <div className={mystyle.options}  onClick={handle} >29</div>
      <div className={mystyle.options}  onClick={handle} >30</div>
      <div className={mystyle.options}  onClick={handle} >31</div>
    </div>
  )
}

export default DateDrop
