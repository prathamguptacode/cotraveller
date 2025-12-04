import React from 'react'
import mystyle from './homepage.module.css'
import darkBanner from '../../assets/darkBanner.svg'
import { useAuth } from '../../hooks/useAuth'

function Banner() {
  const { user } = useAuth()

  return (
    <div className={mystyle.banner}>
      <img src={darkBanner} alt="banner svg" />
      <div className={mystyle.title}>Welcome {user && user.fullName.split(' ')[0]}!</div>
    </div>
  )
}

export default Banner
