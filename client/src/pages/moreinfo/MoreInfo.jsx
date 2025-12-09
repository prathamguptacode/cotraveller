import React, { useRef, useState } from 'react'
import mystyle from './MoreInfo.module.css'
import Navbar from '../../components/homepage/Navbar'
import { FaUser } from "react-icons/fa6";
import { api, callAuthApi } from '../../api/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import clsx from 'clsx';
import LoadingPage from '../Extras/LoadingPage';
import { FaHeartCrack } from "react-icons/fa6";

function MoreInfo() {

    const [val, setVal] = useState({})
    const [member, setMember] = useState([])
    const [comment, setComment] = useState([])
    const [time, setTime] = useState([])
    const [loadind, setLoading] = useState(true);
    const { user } = useAuth()
    const [hasRequested, setHasRequested] = useState(val?.requests?.includes(user?._id))

    const navigate = useNavigate()

    const [q] = useSearchParams()
    useState(() => {
        (async () => {
            const id = q.get("q")
            const res = await api.get(`/group/viewgroup?q=${id}`)
            const data = res.data.data[0];
            setHasRequested(data?.requests?.includes(user?._id))
            setVal(data)
            setMember(data.member)
            setComment(data.comments)
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        if (!Object.values(val).length == 0) {
            const timeZ = new Date(val.travelDate)
            const intime = timeZ.toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                year: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
            setTime(intime)
        }
    }, [val])


    const sendRequest = async () => {
        if (!user) {
            return navigate('/login')
        }
        const { status, data } = await callAuthApi('post', '/group/addRequest', { groupID: val._id })
        if (status == 201) setHasRequested(true)
        else {
            setHasRequested(false)
            if (data.message == 'member cannot send the request') {
                return toast.error('you are a member of this group', {
                    style: {
                        borderRadius: '10px',
                        background: 'var(--toast-bg)',
                        color: 'var(--toast-color)',
                    }
                })
            }
            console.error(data.message)
        }
    }



    const incomment = useRef()

    function focus() {
        incomment.current.focus()
    }

    async function share() {
        const url = window.location.href;
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to your clipboard', {
            style: {
                borderRadius: '10px',
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
            }
        })

    }

    async function commentPost() {
        if (user == null) {
            navigate('/login')
            return
        }
        const comment = incomment.current.value;
        const targetGroup = val._id;

        if (!comment) {
            return toast.error("please enter the comment", {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                }
            })
        }
        const body = {
            comment,
            targetGroup
        }
        const temp = {
            comment,
            author: user.fullName
        }
        setComment((prev) => [temp, ...prev])
        const res = await api.post('comments/comment', body)
        if (res.status == 201) {
            toast.success("commented successfully", {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                }
            })
            incomment.current.value = ""
        }
        else {
            toast.error("something went wrong", {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                }
            })
            setComment((prev) => {
                let copy = [...prev]
                copy.shift()
                return copy
            })
        }
    }

    return (
        <div>
            <Navbar />
            {
                loadind ? <LoadingPage /> :
                    <div className={mystyle.wrapper}>
                        <div className={mystyle.wrap}>
                            <div className={mystyle.profile}>
                                <FaUser />
                            </div>
                            <div className={mystyle.infoWrapper}>
                                <div className={mystyle.parent}>
                                    <div className={mystyle.can}>
                                        <h2 className={mystyle.title}>
                                            {val.title}
                                        </h2>
                                        <p className={mystyle.content}>{val.content}</p>
                                        <div className={mystyle.detail}>
                                            <p className={mystyle.time}>Date & Time: {time}</p>
                                            <p className={mystyle.transport}>Transport: {val.mode}</p>
                                            <p className={mystyle.college}>College: {val.intialLocation}</p>
                                        </div>
                                    </div>
                                    <div className={mystyle.memberbx}>
                                        <div className={mystyle.memtitle}>Members</div>
                                        {
                                            member.map((e) => {
                                                return (
                                                    <div key={e._id} className={mystyle.member}>
                                                        <div className={mystyle.memberAvatarWrapper}>
                                                            <FaUser />
                                                        </div>
                                                        <div className={mystyle.name}>{e._id !== user?._id ? e.fullName : "You"}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={mystyle.btnbox}>
                                    <button className={mystyle.moreinfo} onClick={focus}>Add comment</button>
                                    <button className={mystyle.sharebtn} onClick={share}>Share</button>
                                    {member.some(e => e._id === user?._id) ? <Link to={`/groups/${q.get('q')}/chats`} className={mystyle.groupbtn}>Chat now</Link> : <button onClick={sendRequest} className={clsx(mystyle.groupbtn, hasRequested && mystyle.requested)}>{hasRequested ? 'Request Sent' : 'Send Request'}</button>}

                                </div>
                            </div>
                        </div>
                        <div className={mystyle.line}></div>
                        <div className={mystyle.commentbx}>
                            <div className={mystyle.commentTitle}>Comments:</div>
                            <div className={mystyle.input}>
                                <div className={mystyle.questionTitle}>
                                    <input onKeyDown={(e) => {
                                        if (e.key === "Enter") commentPost()
                                    }} type="text" placeholder='Add a comment' className={mystyle.inbx} ref={incomment} />
                                    <button onClick={commentPost} className={mystyle.addbtn} >Post</button>
                                </div>
                            </div>
                            {
                                comment.length == 0 ? <div className={mystyle.defComment}>
                                    <FaHeartCrack size="22px" />
                                    No comments yet — be the first to share your thoughts!
                                </div> :
                                    comment.map((e) => {
                                        return (
                                            <div className={mystyle.comments}>
                                                <FaUser size="24px" />
                                                <div className={mystyle.commentcan}>
                                                    <div className={mystyle.userComment}>{e.author}</div>
                                                    <div className={mystyle.conComment}>{e.comment}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )
                            }
                        </div>
                        <Toaster />
                    </div>
            }
        </div >
    )
}

export default MoreInfo
