import React from 'react'
import mystyle from './Navbar.module.css'
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  return (
    <div className={mystyle.navbarWrapper}>
      <div className={mystyle.navabar}>
        <div className="hamburgerbox">
            <GiHamburgerMenu style={{color: 'white',size: '22px'}}/>
        </div>
      </div>
    </div>
  )
}

export default Navbar
