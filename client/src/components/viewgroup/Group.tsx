import { useState } from 'react'
import mystyle from './Group.module.css'
import { callAuthApi } from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

type GroupProps = {
    element: {
        _id: string;
        title: string;
        content: string;
        ownerPop: {
            fullName: string;
        };
        travelDate: string;
        comments?: Array<any>;
        requests?: Array<string>;
    };
};

function Group({ element }: GroupProps) {
    const title = element.title;
    const content = element.content;
    const members = element.ownerPop.fullName;
    const time = (element.travelDate);
    const commentNum = element.comments?.length;
    const timeZ = new Date(time)
    const timeInd = timeZ.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
    const id = element._id;

    const navigate = useNavigate()

    const { user } = useAuth()
    const [hasRequested, setHasRequested] = useState<boolean | undefined>(element?.requests?.includes(user?._id ?? ''))
    const sendRequest = async () => {
        if (!user) {
            return navigate('/login')
        }
        const { status, data } = await callAuthApi('post', '/group/addRequest', { groupID: element._id })
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
        }
    }

    function nav() {
        navigate(`/moreinfo?q=${id}`)
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
                    <div className={mystyle.comments}>{commentNum ? commentNum : "0"} {commentNum == 1 ? 'comment' : 'comments'}</div>
                </div>
                <div className={mystyle.btnbox}>
                    <button aria-label='Send Request' onClick={sendRequest} className={clsx(mystyle.groupbtn, hasRequested && mystyle.requested)}>{hasRequested ? 'Request Sent' : 'Send Request'}</button>
                    <button aria-label='More info' className={mystyle.groupbtn} onClick={nav}>More info</button>
                </div>
            </div>
            <div className={mystyle.line}></div>
            <Toaster />
        </div>
    )
}

export default Group
