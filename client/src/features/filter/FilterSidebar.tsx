import React, { useState } from 'react'
import mystyle from './FilterSidebar.module.css'
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
import { LuChevronDown } from "react-icons/lu";
import { IoMdAirplane } from "react-icons/io";
import { FaCarSide, FaTrainSubway } from "react-icons/fa6";
import { FaTaxi } from "react-icons/fa";


function FilterSidebar() {

  const [member, setMember] = useState(1);
  const [travelMode, setTravelMode] = useState('Any mode');
  function handlePlus() {
    if (member < 5) {
      return setMember(prev => prev + 1)
    }
    if (member >= 5) {
      return setMember(32)
    }
  }
  function handleMinus() {
    if (member == 32) {
      return setMember(5)
    }
    if (member > 1) {
      setMember(prev => prev - 1)
    }
  }

  return (
    <div className={mystyle.wrapper}>
      <div className={mystyle.member}>
        <div className={mystyle.memberHeading}>Members</div>
        <div className={mystyle.memberbox}>
          <button className={mystyle.memberPlus} onClick={handlePlus}><LuPlus /></button>
          <div>
            {
              member == 1 ? <div>Any</div> : member == 32 ? <div>6+</div> : <div>{member}</div>
            }
          </div>
          <button className={mystyle.memberMinus} onClick={handleMinus}><LuMinus /></button>
        </div>
      </div>

      <div className={mystyle.travelMode}>
        <div className={mystyle.modeHeading}>Travel mode</div>
        <button className={mystyle.modeBox} popoverTarget="modeList">
          {travelMode}
          <div className={mystyle.modeIcon}>
            <LuChevronDown />
          </div>

          <div className={mystyle.modeDrop} popover='auto' id="modeList">
            <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Train</button>
            <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Flight</button>
            <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Taxi</button>
            <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Car</button>
            <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Bike</button>
            <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Any mode</button>
          </div>

        </button>
      </div>



      {/* <div className={mystyle.time}>
        <div className={mystyle.timeHeading}>Travel Range</div>
        <div className={mystyle.timebox}>time inputs that i will need</div>
      </div>

      <div className={mystyle.tags}>
        <div className={mystyle.tagHeading}>Tags</div>
        <div className={mystyle.tagBox}>
          tags:
        </div>
      </div> */}
    </div>
  )
}

export default FilterSidebar
