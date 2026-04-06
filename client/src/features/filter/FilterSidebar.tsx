import React, { useState } from 'react'
import mystyle from './FilterSidebar.module.css'
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
import { LuChevronDown } from "react-icons/lu";


function FilterSidebar() {

  const [member, setMember] = useState(1);
  const [travelMode, setTravelMode] = useState('Any mode');
  const [travelModeDrop, setTravelModeDrop] = useState(false);
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
        <button className={mystyle.modeBox} onClick={() => setTravelModeDrop(true)}>
          {travelMode}
          <div className={mystyle.modeDown}>
            <LuChevronDown />
          </div>
          {
            travelModeDrop && (<div className={mystyle.modeDrop}>
              <div className={mystyle.options}>Train</div>
              <div className={mystyle.options}>Flight</div>
              <div className={mystyle.options}>Taxi</div>
              <div className={mystyle.options}>Car</div>
              <div className={mystyle.options}>Bike</div>
            </div>)
          }
        </button>
      </div>



      <div className={mystyle.time}>
        <div className={mystyle.timeHeading}>Travel Range</div>
        <div className={mystyle.timebox}>time inputs that i will need</div>
      </div>

      <div className={mystyle.tags}>
        <div className={mystyle.tagHeading}>Tags</div>
        <div className={mystyle.tagBox}>
          tags:
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar
