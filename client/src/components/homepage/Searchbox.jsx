import { useState } from 'react'
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
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function Searchbox({ l = 'Where from ?', md = 'Transport ?', d = 'Date ?', m = 'Month ?', y = 'Year ?', w = "", tempMargin = "" }) {

    const navigate = useNavigate()

    const [location, setLocation] = useState(l)
    const [mode, setMode] = useState(md)
    const [date, setDate] = useState(d)
    const [month, setMonth] = useState(m)
    const [year, setYear] = useState(y)
    //###fix date issue

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

    async function search() {
        if (location == "Where from?") {
            toast.error('please enter Location!', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: "  6px 40px"
                },
            }
            );
            return
        }
        if (mode == "Transport?") {
            toast.error('please enter the Transport!', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: "  6px 40px",
                },
            }
            );
            return
        }
        if (date == "Date?") {
            toast.error('please enter the Date!', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: "  6px 40px"
                },
            }
            );
            return
        }
        if (month == "Month?") {
            toast.error('please enter the Month!', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: "  6px 40px"
                },
            }
            );
            return
        }
        if (year == "Year?") {
            toast.error('please enter the Year!', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: "  6px 40px"
                },
            }
            );
            return
        }
        let monthNum = 0;
        if (month == "January") monthNum = '01'
        if (month == "February") monthNum = '02'
        if (month == "March") monthNum = '03'
        if (month == "April") monthNum = '04'
        if (month == "May") monthNum = '05'
        if (month == "June") monthNum = '06'
        if (month == "July") monthNum = '07'
        if (month == "August") monthNum = '08'
        if (month == "September") monthNum = '09'
        if (month == "October") monthNum = '10'
        if (month == "November") monthNum = '11'
        if (month == "December") monthNum = '12'
        const lowerTime = `${year}-${monthNum}-${date}T00:00`
        const upperTime = `${year}-${monthNum}-${date}T23:59`
        navigate(`/viewgroup?q=${location}&mode=${mode}&lowerT=${lowerTime}&upperT=${upperTime}&d=${date}&m=${month}&y=${year}`)
    }


    return (
        <div>
            <div className={mystyle.searchbox} style={{ maxWidth: w, marginTop: tempMargin }}>
                <div className={clsx(mystyle.location, mystyle.inhover)} tabIndex="0" style={{gridArea: 'from'}} onClick={showL} onBlur={hidL}>
                    <FaLocationDot />
                    <div>{location}</div>
                    {locationDropDis ? <LocationDrop setLocation={setLocation} /> : null}
                </div>
                <div className={clsx(mystyle.mode, mystyle.inhover)} tabIndex="0"  style={{gridArea: 'mode'}} onClick={showT} onBlur={hidT}>
                    {(mode == "Transport ?") ? <FaPaperPlane /> : null}
                    {(mode == "Airplane") ? <IoMdAirplane size="22px" /> : null}
                    {(mode == "Railway") ? <FaTrainSubway /> : null}
                    {(mode == "Taxi") ? <FaTaxi /> : null}
                    <div>{mode}</div>
                    {modeDropDis ? <ModeDrop setMode={setMode} /> : null}
                </div>
                <div className={clsx(mystyle.date, mystyle.inhover)} tabIndex="0"  style={{gridArea: 'date'}} onClick={showD} onBlur={hidD}>{date}
                    {dateDropDis ? <DateDrop setDate={setDate} /> : null}
                </div>
                <div className={clsx(mystyle.month, mystyle.inhover)} tabIndex="0"  style={{gridArea: 'month'}} onClick={showM} onBlur={hidM}>{month}
                    {monthDropDis ? <MonthDrop setMonth={setMonth} /> : null}
                </div>
                <div className={clsx(mystyle.year, mystyle.inhover)} tabIndex="0"  style={{gridArea: 'year'}} onClick={showY} onBlur={hidY}>{year}
                    {yearDropDis ? <YearDrop setYear={setYear} /> : null}
                </div>
            </div>


            <div className={mystyle.btnbox}>
                <button aria-label='Search' className={mystyle.searchbtn} onClick={search}>
                    <IoMdSearch size="20px" />
                    Find groups
                </button>
                <Toaster />
            </div>


        </div>
    )
}

export default Searchbox
