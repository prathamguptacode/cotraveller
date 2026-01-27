import mystyle from '../homepage/homepage.module.css'
import ThemeButton from '../Buttons/ThemeButton'
import { Link } from 'react-router-dom'

function NewNav() {
    // $$$please include profile picture feature
    return (
        <div className={mystyle.navbar}>
            <div className={mystyle.logo}><Link to='/'>Cotraveller</Link></div>
            <div className={mystyle.nobox}></div>
            <div className={mystyle.themebtn}><ThemeButton /></div>
        </div>
    )
}

export default NewNav
