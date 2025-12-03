import React from 'react'
import mystyle from './Navbar.module.css'
import { GiHamburgerMenu } from "react-icons/gi";
import ThemeButton from '../Buttons/ThemeButton';
import { IoIosMail } from "react-icons/io";
import {clsx} from 'clsx'


function Navbar() {
  return (
    <div className={mystyle.navbarWrapper}>
      <div className={mystyle.navbar}>
        <GiHamburgerMenu size='32px' className={mystyle.svgpointter}/>
        <div className={mystyle.logo}>
          Cotraveller
        </div>
        <div className={mystyle.dummybx}></div>
        <ThemeButton size='28px'/>
        <div className={mystyle.notificationbx}>
          <IoIosMail size='32px' className={clsx(mystyle.svgpointter)} />
        </div>
        <button className={mystyle.signup}>Sign up</button>
        <button className={mystyle.login}>Login in</button>
        <button className={mystyle.createBtn}>Create Group</button>
      </div>
    </div>
  )
}

export default Navbar
