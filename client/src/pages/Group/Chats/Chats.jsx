import React, { useEffect, useState } from 'react'
import styles from './chats.module.css'
import { Mail, MessagesSquare, SendHorizontal, Cog, LogOut, HelpCircle, ChevronsLeft, Ellipsis, Smile, CheckCheck } from 'lucide-react'
import clsx from 'clsx'
import Groups from '../../../components/homepage/Sidebar/Groups'
import Inbox from '../../../components/homepage/Sidebar/Inbox'
import Outbox from '../../../components/homepage/Sidebar/Outbox'
import { useParams } from 'react-router-dom'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'
import { useSocket } from '../../../hooks/useSocket'





const Chats = () => {
    const { groupId } = useParams()
    const [group, setGroup] = useState({})
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const socket = useSocket()
    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {

        (async () => {
            setLoading(true)
            const { status, data } = await callAuthApi('get', `/message/${groupId}`)
            if (status === 200) {
                const { group } = data.data
                setGroup(group)
                setMessages(group.messages)
                setLoading(false)
            }
            else console.error(data.message)
        })()


    }, [groupId])

    useEffect(() => {
        if (loading) return
        socket.emit('JOIN_ROOM', { roomId: groupId, userId: user._id }, (res) => {
            if (!res.success) console.error('Error connecting to chatRoom')
            else console.log('Connected to ChatRoom:', res.message, res.id)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() => {
        socket.on('RECEIVE_MESSAGE_ON_CLIENT', (data) => {
            setMessages(prev => [...prev, data.message])
        })
    }, [socket])



    const sendMessage = () => {
        socket.emit('SEND_MESSAGE_TO_SERVER', { text, roomId: groupId, userId: user._id }, (res) => {
            if (!res.success) return console.error(res.message)
            setMessages(prev => [...prev, res.message])

        })
        setText('')

    }


    const handleLogout = async () => {
        const { status } = await callAuthApi('post', '/auth/logout')

        if (status == 204) window.location.href = '/'
        else console.error('SOMETHING WENT WRONG')
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.sidebarWrapper}>

                    <div className={styles.list}>
                        <button className={styles.listItem}>
                            <MessagesSquare size={28} />
                            <ToolTip text={'Chats'} />
                        </button>
                        <button className={styles.listItem}>
                            <Mail size={26} />
                            <ToolTip text={'Inbox'} />

                        </button>
                        <button className={styles.listItem}>
                            <SendHorizontal size={26} />
                            <ToolTip text={'Sent'} />
                        </button>
                    </div>

                    <div className={clsx(styles.list, styles.footerList)}>
                        <button className={styles.listItem}>
                            <Cog size={28} />
                            <ToolTip text={'Settings'} />
                        </button>
                        <button className={styles.listItem}>
                            <HelpCircle size={26} />
                            <ToolTip text={'Help'} />
                        </button>
                        <button onClick={handleLogout} className={styles.listItem}>
                            <LogOut size={26} />
                            <ToolTip text={'Logout'} />
                        </button>
                    </div>

                </div>

                <div className={styles.sidebarExpansionWrapper}>

                    <div className={styles.expansionHeader}>
                        <h2>Chats</h2>
                        <button className={styles.listItem}>
                            <ChevronsLeft size={28} strokeWidth={1.4} />
                            <ToolTip text={'Hide'} />
                        </button>
                    </div>

                    {/* <div className={styles.searchAreaWrapper}>
               // ###ADD LATER if needed , maybe to search for something, idk
                </div> */}

                    <Groups />
                    {/* <Inbox /> */}
                    {/* <Outbox /> */}
                </div>



                {!loading && <div className={styles.chatAreaWrapper}>
                    <div className={styles.chatAreaHeader}>

                        <div className={styles.avatarWrapper}>
                            <img src="/apple-light.svg" alt="avatar" />
                        </div>

                        {/* ###LATER add feature to go view group details by pressing on groupDetails contents */}
                        <div className={styles.groupDetails}>
                            <h3>
                                {group.title}
                            </h3>
                            <p>{group.members.map(member => {
                                return (
                                    <span key={member._id}>{member.fullName}</span>
                                )
                            })}</p>
                        </div>

                        <button className={clsx(styles.groupOptions, styles.listItem)}>
                            <Ellipsis />
                        </button>

                    </div>

                    <div className={styles.messages}>



                        {messages.map(message => {
                            const isMyMessage = message.author._id == user._id
                            return (
                                <div key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                                    {!isMyMessage && <div className={styles.messageAuthor}>
                                        {message.author.fullName}
                                    </div>}
                                    <div className={styles.messageDetails}>
                                        <div className={styles.messageText}>
                                            {message.text}
                                        </div>
                                        <div className={styles.messageTime}>
                                            5:40 AM
                                            {/* message.time has the createdAt thingy */}
                                        </div>
                                        {isMyMessage && <div className={styles.messageSeenState}>
                                            <CheckCheck color='#09eb42ff' size={18} />
                                        </div>}
                                    </div>
                                </div>
                            )
                        })}


                    </div>



                    <div className={styles.inputAreaWrapper}>
                        <div className={styles.inputWrapper}>
                            <input onKeyDown={(e) => {
                                if (e.key !== "Enter" || !text) return
                                sendMessage()
                            }} onChange={(e) => setText(e.target.value)} value={text} type="text" />
                            <button>
                                <Smile size={20} />
                            </button>

                        </div>
                    </div>

                </div>}


            </div >
        </>

    )
}

export default Chats

export const ToolTip = ({ text, className }) => {
    return (
        <span className={clsx(styles.listItemTooltip, styles[className])}>
            {text}
        </span>
    )
}