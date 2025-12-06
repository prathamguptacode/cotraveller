import React, { useRef } from 'react'
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
import toast, { Toaster } from 'react-hot-toast'
import { api } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function QuestionTile() {

    const navigate=useNavigate()

    const [location, setLocation] = useState("Location?")
    const [mode, setMode] = useState('Transport?')
    const [date, setDate] = useState("Date?")
    const [month, setMonth] = useState("Month?")
    const [year, setYear] = useState("Year?")

    const title = useRef()
    const content = useRef()

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

    async function handleSubmit() {
        const titleVal = title.current.value;
        const contentVal = content.current.value;
        if (!titleVal) return toast.error("please enter the Name", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                padding: '6px 20px'
            }
        })
        if (!contentVal) return toast.error("please enter the Description", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                padding: '6px 20px'
            }
        })
        if (titleVal.length < 5) return toast.error("Name cannot be less then 4 characters", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
            }
        })
        if (contentVal.length < 13) return toast.error("Description cannot be less then 12 characters", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
            }
        })

        if ((date == 'Date?') || (month == 'Month?') || (year == 'Year?')) return toast.error("Please select your Travel Dates", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
            }
        })

        if (mode == 'Transport?') return toast.error("Please select your Transport", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
            }
        })

        if (location == 'Location?') return toast.error("Please select your College", {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
            }
        })

        let monthNum = 0;
        if (month == "January") monthNum = '01'
        if (month == "Febuary") monthNum = '02'
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

        const indTime= `${year}-${monthNum}-${date}T${hour}:${min}`
        const zobj=new Date(indTime)
        const time=zobj.toISOString()

        const body = {
            title: titleVal,
            content: contentVal,
            mode: mode,
            intialLocation: location,
            memberNumber: member,
            travelDate: time
        }
        try {
            const res = await api.post('/group/addgroup', body)
            if(res.status){
                navigate('/success', { state: {click: true}})
            }
        } catch (error) {
            toast.error("Something went wrong", {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                }
            })
        }

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
                    <input type="text" placeholder='My first Manali Trip' className={mystyle.inbx} ref={title} />
                </div>
                <div className={mystyle.questionTitle}>
                    <div className={mystyle.ques}>Description of your Travel Group?</div>
                    <input type="text" placeholder='Going on 24Feb, 2026 by train no. 1243' className={mystyle.inbx} ref={content} />
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

            <Toaster />
        </>
    )
}

export default QuestionTile


