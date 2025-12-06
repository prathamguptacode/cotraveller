import React, { useEffect, useState } from 'react'
import mystyle from './Group.module.css'
import { api, callAuthApi } from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx'
import { data } from 'react-router-dom';

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


    const { user } = useAuth()
    const [hasRequested, setHasRequested] = useState(element?.requests?.includes(user?._id))

    
    const sendRequest = async () => {
        if (!user) return //###CHANGE LATER for redirection
        const { status, data } = await callAuthApi('post', '/group/addRequest', { groupID: element._id })
        if (status == 201) setHasRequested(true)
        else {
            setHasRequested(false)
            console.error(data.message)
        }
    }




    return (
        <div className={mystyle.linewrapper}>
            <div className={mystyle.groupwrapper}>
                <div className={mystyle.group}>
                    <div className={mystyle.memberbx}>

                        <div className={mystyle.members}>{members}</div>

                    </div>
                    <div className={mystyle.title}>{title}</div>
                    <div className={mystyle.content}>{content}</div>
                    <div className={mystyle.time}>Time: {timeInd}</div>
                    <div className={mystyle.comments}>{commentNum} comments</div>
                </div>
                <div className={mystyle.btnbox}>
                    <button onClick={sendRequest} className={clsx(mystyle.groupbtn, hasRequested && mystyle.requested)}>{hasRequested ? 'Request Sent' : 'Send Request'}</button>
                    <button className={mystyle.groupbtn}>More info</button>
                </div>
            </div>
            <div className={mystyle.line}></div>
        </div>
    )
}

export default Group
