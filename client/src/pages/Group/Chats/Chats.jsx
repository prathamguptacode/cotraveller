import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './chats.module.css'
import { Mail, MessagesSquare, SendHorizontal, Cog, LogOut, HelpCircle, ChevronsLeft, Ellipsis, Smile, CheckCheck, ChevronDown, Info } from 'lucide-react'
import clsx from 'clsx'
import Groups from '../../../components/homepage/Sidebar/Groups'
import Inbox from '../../../components/homepage/Sidebar/Inbox'
import Outbox from '../../../components/homepage/Sidebar/Outbox'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'
import { useSocket } from '../../../hooks/useSocket'
import { Howl } from 'howler'
import { FaPeopleGroup } from 'react-icons/fa6'




const Chats = () => {
    const { groupId } = useParams()
    const [group, setGroup] = useState({})
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const socket = useSocket()
    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])

     const navigate = useNavigate()

    const ping = useMemo(() => new Howl({
        src: ['/sounds/notify.mp3'],
        // html5:true,
        volume: 0.25,
        preload: true,
    }), [])












    const messagesRef = useRef()
    const lastMessageRef = useRef()
    const [lastMessage, setLastMessage] = useState('')
    const [isMounted, setIsMounted] = useState(false)


    // // For initial instant scroll to bottom
    useEffect(() => {
        if (isMounted || messages.length == 0) return

        const div = messagesRef.current
        scrollToBottom()
        //Now we add smoothScroll class for further auto-scroll
        div.style['scroll-behavior'] = 'smooth'
        setIsMounted(true)
    }, [messages])





    //For further auto-scroll:
    //Case-1: Last message is in view : Auto scroll 
    //Case-2: If not in view then: start showing scroll to bottom and :
    //Case-2a: If message is sent by current user then : auto scroll
    //Case-2b: If message is sent by any other user just show total count of unread messages on scroll to bottom button


    const [unreadCount, setUnreadCount] = useState(0)
    const [isIntersecting, setIsIntersecting] = useState(true)

    const observer = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) setIsIntersecting(false)
        else {
            setIsIntersecting(true)
            setUnreadCount(0)
        }
    }, { threshold: 0 })

    useEffect(() => {
        if (messages.length == 0) return
        observer.observe(lastMessageRef.current)

    }, [messages])

    useEffect(() => {
        //Run for every non-first(i.e. exclude initial render) message
        if (!lastMessage) return

        if (lastMessage.author._id != user._id && !isIntersecting) {
            setUnreadCount(count => count + 1)
            ping.play()
        }

        else scrollToBottom()



    }, [lastMessage])



    const scrollToBottom = () => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
















    useEffect(() => {

        (async () => {
            setLoading(true)
            const { status, data } = await callAuthApi('get', `/message/${groupId}`)
            if (status === 200) {
                const { group } = data.data
                setGroup(group)
                setMessages([...group.messages])
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
            setLastMessage(data.message)
        })
    }, [socket])



    const sendMessage = () => {
        socket.emit('SEND_MESSAGE_TO_SERVER', { text, roomId: groupId, userId: user._id }, (res) => {
            if (!res.success) return console.error(res.message)
            setMessages(prev => [...prev, res.message])
            setLastMessage(res.message)

        })
        setText('')

    }


    const handleLogout = async () => {
        const { status } = await callAuthApi('post', '/auth/logout')

        if (status == 204) window.location.href = '/'
        else console.error('SOMETHING WENT WRONG')
    }

    function handleFeedback() {
        navigate('/feedback')
    }

    const getFormattedTime = (time) => {
        const timeZ = new Date(time)
        return timeZ.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
    }



    const [currentTab, setCurrentTab] = useState('Chats')

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.sidebarWrapper}>

                    <div className={styles.list}>
                        <button onClick={() => setCurrentTab('Chats')} className={styles.listItem}>
                            <MessagesSquare size={28} />
                            <ToolTip text={'Chats'} />
                        </button>
                        <button onClick={() => setCurrentTab('Inbox')} className={styles.listItem}>
                            <Mail size={26} />
                            <ToolTip text={'Inbox'} />

                        </button>
                        <button onClick={() => setCurrentTab('Sent')} className={styles.listItem}>
                            <SendHorizontal size={26} />
                            <ToolTip text={'Sent'} />
                        </button>
                    </div>

                    <div className={clsx(styles.list, styles.footerList)}>
                        <button className={styles.listItem}>
                            <Cog size={28} />
                            <ToolTip text={'Settings'} />
                        </button>
                        <button onClick={handleFeedback} className={styles.listItem}>
                            <Info size={26} />
                            <ToolTip text={'Feedback'} />
                        </button>
                        <button onClick={handleLogout} className={styles.listItem}>
                            <LogOut size={26} />
                            <ToolTip text={'Logout'} />
                        </button>
                    </div>

                </div>

                <div className={styles.sidebarExpansionWrapper}>

                    <div className={styles.expansionHeader}>
                        <h2>{currentTab}</h2>
                        {/* <button onClick={hideExpansion} className={styles.listItem}>
                            <ChevronsLeft size={28} strokeWidth={1.4} />
                            <ToolTip text={'Hide'} />
                        </button> */}
                    </div>

                    {/* <div className={styles.searchAreaWrapper}>
               // ###ADD LATER if needed , maybe to search for something, idk
                </div> */}
                    {/* <div className={styles.expansionList}> */}
                    {currentTab === "Chats" ? <Groups /> : currentTab === "Inbox" ? <Inbox /> : <Outbox />}
                    {/* </div> */}

                </div>

                <div className={styles.chatAreaWrapper}>
                    <div className={styles.chatAreaHeader}>

                        <Link to={`/moreinfo?q=${groupId}`} className={styles.avatarWrapper}>
                            <FaPeopleGroup />
                        </Link>


                        <div className={styles.groupDetails}>
                            <h3>
                                <Link to={`/moreinfo?q=${groupId}`}>{group.title}</Link>
                            </h3>


                            <Link className={styles.members} to={`/moreinfo?q=${groupId}`}>
                                {
                                    group.members?.map(member => {
                                        return (
                                            <div> {member.fullName}</div>
                                        )
                                    })
                                }

                            </Link>

                        </div>

                        <button className={clsx(styles.groupOptions, styles.listItem)}>
                            <Ellipsis />
                        </button>

                    </div>

                    <div ref={messagesRef} className={styles.messages}>



                        {messages.length != 0 && messages.map((message, i, arr) => {
                            const isMyMessage = message.author._id == user._id
                            const timeDiff = i > 0 && new Date(arr[i - 1].createdAt).getTime() - new Date(message.createdAt).getTime()
                            const hideName = i > 0 ? (arr[i - 1].author._id == message.author._id && Math.abs(timeDiff) < 60 * 1000) : false


                            return (
                                <div ref={i === arr.length - 1 ? lastMessageRef : null} key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                                    {(!isMyMessage && !hideName) && <div className={styles.messageAuthor}>
                                        {message.author.fullName}
                                    </div>}
                                    <div className={styles.messageDetails}>
                                        <div className={styles.messageText}>
                                            {message.text}
                                        </div>
                                        <div className={styles.messageTime}>
                                            {getFormattedTime(message.createdAt)}
                                        </div>
                                        {/* {isMyMessage && <div className={styles.messageSeenState}>
                                            <CheckCheck color='#09eb42ff' size={18} />
                                        </div>} */}
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
                            <button onClick={sendMessage} className={styles.sendBtn}>
                                <SendHorizontal size={20} />
                            </button>
                            <button>
                                <Smile size={20} />
                            </button>

                        </div>
                        <button onClick={scrollToBottom} className={clsx(styles.scrollBtn, !isIntersecting && styles.showScrollBtn)}>
                            {unreadCount > 0 && <div className={styles.unreadCounter}>{unreadCount}</div>}
                            <ChevronDown size={26} strokeWidth={1.4} />
                        </button>
                    </div>

                </div>


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