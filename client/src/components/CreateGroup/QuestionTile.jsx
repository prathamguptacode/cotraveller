import React from 'react'
import mystyle from './CreateGroup.module.css'
import { IoMdAirplane } from "react-icons/io";
import { FaTrainSubway } from "react-icons/fa6";
import { FaTaxi } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import clsx from 'clsx'
import { useState } from 'react';
import rock from '../homepage/homepage.module.css'
import ModeDrop from '../homepage/dropDown/modeDrop';
import DateDrop from '../homepage/dropDown/dateDrop';
import MonthDrop from '../homepage/dropDown/monthDrop';
import YearDrop from '../homepage/dropDown/yearDrop';
import LocationDrop from '../homepage/dropDown/locationDrop';
import { FaLocationDot } from "react-icons/fa6";
import btnstyle from '../../pages/CreateGroup/CreateGroup.module.css'
import MemberDrop from './dropDown/memberDrop';
import HourDrop from './dropDown/hourDrop';
import MinDrop from './dropDown/minDrop';

function QuestionTile() {

    const [location, setLocation] = useState("Location?")
    const [mode, setMode] = useState('Transport?')
    const [date, setDate] = useState("Date?")
    const [month, setMonth] = useState("Month?")
    const [year, setYear] = useState("Year?")

    const [member, setMember] = useState("2")
    const [hour, setHour] = useState("00")
    const [min, setMin] = useState("00")

    const [locationDropDis, setLocationDropDis] = useState(0)
    const [modeDropDis, setModeDropDis] = useState(0)
    const [dateDropDis, setDateDropDis] = useState(0)
    const [monthDropDis, setMonthDropDis] = useState(0)
    const [yearDropDis, setYearDropDis] = useState(0)
    const [memberDropDis, setMemberDropDis] = useState(0)
    const [hourDropDis, setHourDropDis] = useState(0)
    const [minDropDis, setMinDropDis] = useState(0)

    function handleSubmit() {
        console.log('huray')
    }


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

    function showMem() {
        setMemberDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidMem() {
        setMemberDropDis(0)
    }
    function showHH() {
        setHourDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidHH() {
        setHourDropDis(0)
    }
    function showMM() {
        setMinDropDis(prev => (prev === 0 ? 1 : 0))
    }
    function hidMM() {
        setMinDropDis(0)
    }


    return (
        <>
            <div className={mystyle.quesWrapper}>
                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Name of your Travel Group?</div>
                    <input type="text" placeholder='My first Manali Trip' className={mystyle.inbx} />
                </div>
                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Description of your Travel Group?</div>
                    <input type="text" placeholder='Going on 24Feb, 2026 by train no. 1243' className={mystyle.inbx} />
                </div>

                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Dates of your Travel?</div>
                    <div className={mystyle.datebox}>
                        {/* here we go */}
                        <div className={clsx(rock.date, rock.inhover, mystyle.inDrop)} tabIndex="0" onClick={showD} onBlur={hidD}>{date}
                            {dateDropDis ? <DateDrop setDate={setDate} /> : null}
                        </div>
                        <div className={clsx(rock.month, rock.inhover, mystyle.inDrop)} tabIndex="0" onClick={showM} onBlur={hidM}>{month}
                            {monthDropDis ? <MonthDrop setMonth={setMonth} /> : null}
                        </div>
                        <div className={clsx(rock.year, rock.inhover, mystyle.inDrop)} tabIndex="0" onClick={showY} onBlur={hidY}>{year}
                            {yearDropDis ? <YearDrop setYear={setYear} /> : null}
                        </div>
                    </div>
                </div>

                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>
                        At what time you will be leaving your College?
                    </div>
                    <div className={mystyle.timeBox}>
                        <div className={mystyle.hour} tabIndex="0" onClick={showHH} onBlur={hidHH}>
                            {hour}
                            {hourDropDis ? <HourDrop setHour={setHour} /> : null}
                        </div>
                        <div className={mystyle.semi}>:</div>
                        <div className={mystyle.hour} tabIndex="0" onClick={showMM} onBlur={hidMM}>
                            {min}
                            {minDropDis ? <MinDrop setMin={setMin} /> : null}
                        </div>
                    </div>
                </div>

                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Transport of your Travel?</div>

                    <div className={mystyle.dropmenu}>
                        {/* here we go */}
                        <div className={clsx(rock.mode, rock.inhover, mystyle.inDrop)} tabIndex="0" onClick={showT} onBlur={hidT} style={{ width: "fit-content" }} >
                            {(mode == "Transport?") ? <FaPaperPlane /> : null}
                            {(mode == "Airplane") ? <IoMdAirplane size="22px" /> : null}
                            {(mode == "Railway") ? <FaTrainSubway /> : null}
                            {(mode == "Taxi") ? <FaTaxi /> : null}
                            {mode}
                            {modeDropDis ? <ModeDrop setMode={setMode} /> : null}
                        </div>
                    </div>
                </div>


                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Your College? </div>
                    <div className={mystyle.dropmenu}>
                        {/* here we go */}
                        <div className={clsx(rock.location, rock.inhover, mystyle.inDrop)} tabIndex="0" onClick={showL} onBlur={hidL} style={{ width: "fit-content" }}>
                            <FaLocationDot />
                            {location}
                            {locationDropDis ? <LocationDrop setLocation={setLocation} /> : null}
                        </div>
                    </div>
                </div>

                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Number of people you are looking for your Travel Group?</div>
                    <div className={mystyle.memberDrop} tabIndex="0" onClick={showMem} onBlur={hidMem}>
                        {member === 32 ? "6+" : member}
                        {memberDropDis ? <MemberDrop setMember={setMember} /> : null}
                    </div>
                </div>



            </div>

            <button className={btnstyle.submitbtn} onClick={handleSubmit} >Create Group</button>
        </>
    )
}

export default QuestionTile


