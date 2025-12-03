import mystyle from '../homepage.module.css'
import React from 'react'
import { IoMdAirplane } from "react-icons/io";
import { FaTrainSubway } from "react-icons/fa6";
import { FaTaxi } from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";

function ModeDrop({ setMode }) {

    function handleClick0() {
        setMode('Airplane')
    }
    function handleClick1() {
        setMode('Railway')
    }
    function handleClick2() {
        setMode('Taxi')
    }

    return (
        <div className={mystyle.modeDrop}>
            <div className={mystyle.options} onClick={handleClick0}>
                <IoMdAirplane size="22px" />
                Airplane
            </div>
            <div className={mystyle.options} onClick={handleClick1}>
                <FaTrainSubway size="20px" />
                Railway</div>
            <div className={mystyle.options} onClick={handleClick2}>
                <FaTaxi size="20px" />
                Taxi</div>
        </div>
    )
}

export default ModeDrop
