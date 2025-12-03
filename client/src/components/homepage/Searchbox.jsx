import React, { useEffect, useState } from 'react'
import mystyle from './homepage.module.css'
import clsx from 'clsx'
import { FaLocationDot } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import LocationDrop from './locationDrop';

function Searchbox() {

    const [location,setLocation]=useState('Where from?')
    const [mode,setMode]=useState('Transport?')
    const [date,setDate]=useState('Date?')
    const [month,setMonth]=useState('Month?')
    const [year,setYear]=useState('Year?')

    const [locationDropDis,setLocationDropDis]=useState(0)
    const [modeDropDis,setModeDropDis]=useState(0)

    function showL(){
        setLocationDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidL(){
        setLocationDropDis(0)
    }
    return (
        <div>
            <div className={mystyle.searchbox}>
                <div className={clsx(mystyle.location, mystyle.inhover)} tabIndex="0" onClick={showL} onBlur={hidL}>
                    <FaLocationDot />
                    {location}
                    {locationDropDis? <LocationDrop setLocation={setLocation} />: null}
                </div>
                <div className={clsx(mystyle.mode, mystyle.inhover)} tabIndex="0">
                    <FaPaperPlane />
                    {mode}
                </div>
                <div className={clsx(mystyle.date, mystyle.inhover)} tabIndex="0">{date}</div>
                <div className={clsx(mystyle.month, mystyle.inhover)} tabIndex="0">{month}</div>
                <div className={clsx(mystyle.year, mystyle.inhover)} tabIndex="0">{year}</div>
            </div>
            <div className={mystyle.btnbox}>
                <button className={mystyle.searchbtn}>
                    <IoMdSearch size="20px" />
                    Find groups
                    </button>
            </div>
        </div>
    )
}

export default Searchbox
