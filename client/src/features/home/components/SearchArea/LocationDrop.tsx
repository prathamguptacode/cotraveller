import React from 'react'
import mystyle from './search.module.css'

import { BsBuildingsFill } from "react-icons/bs";

type LocationDropProps = {
  setLocation: React.Dispatch<React.SetStateAction<string>>
}

function LocationDrop({ setLocation }: LocationDropProps) {

  function handleClick0() {
    setLocation('IIT Roorkie')
  }
  function handleClick1() {
    setLocation('IIT Delhi')
  }
  function handleClick2() {
    setLocation('VIT Chennai')
  }
  function handleClick3() {
    setLocation('VIT Vellore')
  }

  return (
    <div className={mystyle.locationDrop}>
      <div className={mystyle.options} onClick={handleClick0}>
        <BsBuildingsFill size="22px" />
        IIT Roorkie
      </div>
      <div className={mystyle.options} onClick={handleClick1}>
        <BsBuildingsFill size="22px" />
        IIT Dhanbad</div>
      <div className={mystyle.options} onClick={handleClick2}>
        <BsBuildingsFill size="22px" />
        VIT Chennai</div>
      <div className={mystyle.options} onClick={handleClick3}>
        <BsBuildingsFill size="22px" />
        VIT Vellore</div>
    </div>
  )
}

export default LocationDrop
