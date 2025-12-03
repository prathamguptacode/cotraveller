import React from 'react'
import mystyle from './Navbar.module.css'
import { GiHamburgerMenu } from "react-icons/gi";
import ThemeButton from '../Buttons/ThemeButton';
import { IoIosMail } from "react-icons/io";

function Navbar() {
  return (
    <div className={mystyle.navbarWrapper}>
      <div className={mystyle.navbar}>
        <GiHamburgerMenu size='36px' />
        <div className={mystyle.logo}>
          Cotraveller
        </div>
        <div className={mystyle.dummybx}></div>
        <ThemeButton size='28px'/>
        <IoIosMail size='28px' />
        <button className={mystyle.createBtn}>Create Group</button>
        <button className={mystyle.signup}>Sign up</button>
        <button className={mystyle.login}>Login in</button>
      </div>
    </div>
  )
}

export default Navbar
