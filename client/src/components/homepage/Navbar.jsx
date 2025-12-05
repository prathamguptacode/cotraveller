import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from './homepage.module.css'
import ThemeButton from '../Buttons/ThemeButton';
import { IoIosMail } from "react-icons/io";
import Sidebar from './Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useState } from "react";

function Navbar() {
    const [isHidden, setisHidden] = useState(true)

    const closeSidebar = () => {
        setisHidden(true)
    }

    // $$$please include profile picture feature

    return (
        <div className={mystyle.navbar}>
            <Link to={'/groups'} onClick={() => setisHidden(prev => !prev)} className={mystyle.hamburger}>
                <GiHamburgerMenu size='20px' />
            </Link>
            <Sidebar isHidden={isHidden} closeSidebar={closeSidebar} />
            <div className={mystyle.logo}><Link to='/'>Cotraveller</Link></div>
            <div className={mystyle.nobox}></div>
            <div className={mystyle.themebtn}><ThemeButton /></div>
            <Link onClick={() => {
                setisHidden(false)
            }} to={'/inbox'} className={mystyle.mail}><IoIosMail size={28} /> </Link>
            <Link to={'/signup'} className={mystyle.navbtn}>Sign up</Link>
            <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>
            <Link to={'/creategroup'} className={mystyle.navbtn}>Create group</Link>
        </div>
    )
}

export default Navbar
