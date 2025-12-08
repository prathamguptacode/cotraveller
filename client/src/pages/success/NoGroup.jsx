import React from 'react'
import mystyle from './success.module.css'
import { GiBoatFishing } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

function NoGroup() {

    const navigate = useNavigate()

    function handleClick() {
        navigate('/creategroup')
    }

    return (
        <div className={mystyle.nogroup}>
        <div className={mystyle.wrapper}>
            <div className={mystyle.nimg}>
            <GiBoatFishing size="100px" />

            </div>
            <div className={mystyle.conbx}>
                <div className={mystyle.ntitle}>No Groups Found… But You Can Start One</div>
                <p className={mystyle.ncon}>We’re sorry — we couldn’t find any groups for this trip.</p>
                <p className={mystyle.ncon}>How about creating your own and letting others join you?</p>
            </div>
            <button className={clsx(mystyle.homebtn, mystyle.createbtn)} onClick={handleClick}>Create Group</button>
        </div>
        </div>
    )
}

export default NoGroup
