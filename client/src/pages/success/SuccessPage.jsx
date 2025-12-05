import React from 'react'
import mystyle from './success.module.css'
import { FaPeopleGroup } from "react-icons/fa6";
import NewNav from '../../components/CreateGroup/newNav';
import {useLocation, useNavigate } from 'react-router-dom';

function SuccessPage() {

    const navigate=useNavigate()

    function handleClick(){
        navigate('/')
    }

    const location=useLocation()
    if(!location.state?.click){
        navigate('/')
        return
    }

    return (
        <div className={mystyle.success}>
            <NewNav />
            <div className={mystyle.successbx}>

            
            <div className={mystyle.imgbx}>
                <FaPeopleGroup size="280px" />
            </div>
            <div className={mystyle.conbx}>
                <div className={mystyle.title}>Your travel group is ready!</div>
                <div className={mystyle.con}>Now wait for the perfect people to join your journey.</div>
                <button className={mystyle.homebtn} onClick={handleClick}>Back to Home</button>
            </div>

            </div>
        </div>
    )
}

export default SuccessPage
