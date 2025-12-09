import mystyle from './NotFound.module.css'
import { BiSolidError } from "react-icons/bi";
import Navbar from '../../components/homepage/Navbar';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className={mystyle.wrapper}>
            <Navbar />
            <div className={mystyle.errorpage}>
                <div className={mystyle.can}>
                    <div className={mystyle.imgbx}>
                        <BiSolidError size={200} />
                    </div>
                    <div className={mystyle.content}>
                        <h2 className={mystyle.title}>
                            Something went wrong !
                        </h2>
                        <p className={mystyle.con}>
                            Cannot find the following page, click on the button below to go back to homepage.
                        </p>
                        <Link className={mystyle.backBtn} to={'/'}>Go back</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
