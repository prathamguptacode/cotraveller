import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from './homepage.module.css'
import ThemeButton from '../Buttons/ThemeButton';
import { IoIosMail } from "react-icons/io";
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className={mystyle.navbar}>
            <div className={mystyle.hamburger}>
                <GiHamburgerMenu size='20px'/>
            </div>
            <div className={mystyle.logo}><Link to='/'>Cotraveller</Link></div>
            <div className={mystyle.nobox}></div>
            <div className={mystyle.themebtn}><ThemeButton /></div>
            <div className={mystyle.mail}><IoIosMail size='28px' /></div>
            <button className={mystyle.navbtn}>Sign up</button>
            <button className={mystyle.navbtn}>Log in</button>
            <button className={mystyle.navbtn}>Create group</button>
        </div>
    )
}

export default Navbar
