import React, { useContext } from 'react'
import airplane from '../../assets/airplane.svg'
import train from '../../assets/train.svg'
import mystyle from './Banner.module.css'

function Banner() {
  return (
    <div className={mystyle.banner}>
        <img src={airplane} alt="airplane" className={mystyle.airplanesvg}/>
        <div className={mystyle.tagline}>Find your vibe.<br />Find your tribe.<br /> Travel together.</div>
        <img src={train} alt="train" className={mystyle.trainsvg}/>
    </div>
  )
}

export default Banner
