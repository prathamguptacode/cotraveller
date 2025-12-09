import React from 'react'
import mystyle from './homepage.module.css'
import darkBanner from '../../assets/darkBanner.svg'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import lightBanner from '../../assets/lightBanner.svg'

function Banner() {
  const { user } = useAuth()
  const { theme }=useTheme()
  
  return (
    <div className={mystyle.banner}>
      {theme == 'dark'? <img src={darkBanner} alt="banner svg" /> : <img src={lightBanner} alt='banner light svg' />}
      <div className={mystyle.title}>Welcome {user && user.fullName.split(' ')[0]}!</div>
    </div>
  )
}

export default Banner
