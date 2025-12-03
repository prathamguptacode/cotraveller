import React from 'react'
import mystyle from './Navbar.module.css'
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  return (
    <div className={mystyle.navbarWrapper}>
      <div className={mystyle.navbar}>
        <GiHamburgerMenu size='36px' color='black'></GiHamburgerMenu>
        <div className={mystyle.login}></div>
      </div>
    </div>
  )
}

export default Navbar
