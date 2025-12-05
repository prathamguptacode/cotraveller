import React, { useEffect, useState } from 'react'
import mystyle from './Group.module.css'
import { api } from '../../api/axios';

function Group({ element }) {
    const title = element.title;
    const content = element.content;
    const members = element.ownerPop.fullName;
    const time = (element.travelDate);
    const commentNum = 0;
    const timeZ = new Date(time)
    const timeInd = timeZ.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })

    
    // useEffect(()=>{
    //     members.forEach(element => {
    //         const val=getname(element)
    //         setMembername((prev)=> [...prev,val])
    //     });
    // },[])

    return (
        <div className={mystyle.linewrapper}>
            <div className={mystyle.groupwrapper}>
                <div className={mystyle.group}>
                    <div className={mystyle.memberbx}>
                        {/* {membername.map(e => {
                                return <div className={mystyle.members}>{e}</div>
                        })} */}
                            <div className={mystyle.members}>{members}</div>
                    </div>
                    <div className={mystyle.title}>{title}</div>
                    <div className={mystyle.content}>{content}</div>
                    <div className={mystyle.time}>Time: {timeInd}</div>
                    <div className={mystyle.comments}>{commentNum} comments</div>
                </div>
                <div className={mystyle.btnbox}>
                    <button className={mystyle.groupbtn}>Send Request</button>
                    <button className={mystyle.groupbtn}>More info</button>
                </div>
            </div>
            <div className={mystyle.line}></div>
        </div>
    )
}

export default Group
