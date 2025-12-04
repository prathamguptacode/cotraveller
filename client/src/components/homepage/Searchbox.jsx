import React, { useEffect, useRef, useState } from 'react'
import mystyle from './homepage.module.css'
import clsx from 'clsx'
import { FaLocationDot } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import LocationDrop from './dropDown/locationDrop';
import ModeDrop from './dropDown/modeDrop';
import DateDrop from './dropDown/dateDrop';
import MonthDrop from './dropDown/monthDrop';
import YearDrop from './dropDown/yearDrop';
import { IoMdAirplane } from "react-icons/io";
import { FaTrainSubway } from "react-icons/fa6";
import { FaTaxi } from "react-icons/fa";

function Searchbox() {

    const modeSvg=useRef()

    const [location, setLocation] = useState('Where from?')
    const [mode, setMode] = useState('Transport?')
    const [date, setDate] = useState('Date?')
    const [month, setMonth] = useState('Month?')
    const [year, setYear] = useState('Year?')

    const [locationDropDis, setLocationDropDis] = useState(0)
    const [modeDropDis, setModeDropDis] = useState(0)
    const [dateDropDis, setDateDropDis] = useState(0)
    const [monthDropDis, setMonthDropDis] = useState(0)
    const [yearDropDis, setYearDropDis] = useState(0)


    function showL() {
        setLocationDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidL() {
        setLocationDropDis(0)
    }
    function showT() {
        setModeDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidT() {
        setModeDropDis(0)
    }
    function showD() {
        setDateDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidD() {
        setDateDropDis(0)
    }
    function showM() {
        setMonthDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidM() {
        setMonthDropDis(0)
    }
    function showY() {
        setYearDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidY() {
        setYearDropDis(0)
    }
    return (
        <div>
            <div className={mystyle.searchbox}>
                <div className={clsx(mystyle.location, mystyle.inhover)} tabIndex="0" onClick={showL} onBlur={hidL}>
                    <FaLocationDot />
                    {location}
                    {locationDropDis ? <LocationDrop setLocation={setLocation} /> : null}
                </div>
                <div className={clsx(mystyle.mode, mystyle.inhover)} tabIndex="0" onClick={showT} onBlur={hidT}>
                    {(mode=="Transport?")? <FaPaperPlane /> : null }
                    {(mode=="Airlane")? <IoMdAirplane /> : null }
                    {(mode=="Railway")? <FaTrainSubway /> : null }
                    {(mode=="Taxi")? <FaTaxi /> : null }
                    {mode}
                    {modeDropDis ? <ModeDrop setMode={setMode} /> : null}
                </div>
                <div className={clsx(mystyle.date, mystyle.inhover)} tabIndex="0" onClick={showD} onBlur={hidD}>{date}
                    {dateDropDis ? <DateDrop setDate={setDate} /> : null}
                </div>
                <div className={clsx(mystyle.month, mystyle.inhover)} tabIndex="0" onClick={showM} onBlur={hidM}>{month}
                    {monthDropDis ? <MonthDrop setMonth={setMonth} />: null}
                </div>
                <div className={clsx(mystyle.year, mystyle.inhover)} tabIndex="0" onClick={showY} onBlur={hidY}>{year}
                    {yearDropDis? <YearDrop setYear={setYear} />: null}
                </div>
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
