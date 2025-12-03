import React from 'react'
import mystyle from './homepage.module.css'
import darkBanner from '../../assets/darkBanner.svg'

function Banner() {
    const data="Welcome"
  return (
    <div className={mystyle.banner}>
      <img src={darkBanner} alt="banner svg" />
      <div className={mystyle.title}>{data}</div>
    </div>
  )
}

export default Banner
