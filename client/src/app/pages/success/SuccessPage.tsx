import mystyle from './success.module.css'
import { FaPeopleGroup } from "react-icons/fa6";
import NewNav from '@/components/CreateGroup/newNav';
import { Link, Navigate, useLocation } from 'react-router-dom';

function SuccessPage() {
    const location = useLocation()


    return location.state?.click ? <div className={mystyle.success}>
        <NewNav />
        <div className={mystyle.successbx}>
            <div className={mystyle.imgbx}>
                <FaPeopleGroup size={280} />
            </div>
            <div className={mystyle.conbx}>
                <h2 className={mystyle.title}>Your travel group is ready!</h2>
                <p className={mystyle.con}>Get ready for the perfect people to join your journey.</p>
                <Link to={'/'} className={mystyle.homebtn} >Back to Home</Link>
            </div>
        </div>
    </div> :
        <Navigate to={'/'} replace />

}

export default SuccessPage
