import styles from '../chats.module.css'
import { useParams } from 'react-router-dom'
import Messages from './Messages'
import MessageComposer from './MessageComposer'
import ScrollToBottomButton from './ScrollToBottomButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Group, Message } from '../types'
import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { callAuthApi } from '@/api/axios'
import scrollToBottom from '../utils/scrollToBottom'
import ChatHeader from './ChatHeader'
import { Howl } from 'howler'

const ChatArea = () => {
  const { groupId } = useParams()

  const [loading, setLoading] = useState(true)

  const [unreadCount, setUnreadCount] = useState(0)
  const [isIntersecting, setIsIntersecting] = useState(true)

  const [group, setGroup] = useState<Group>()
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [lastMessage, setLastMessage] = useState<Message>()


  const messagesRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const socket = useSocket()
  useAutoScroll(messagesRef, messages)


  const ping = useMemo(() => new Howl({
    src: ['/sounds/notify.mp3'],
    volume: 0.25,
    preload: true,
  }), [])



  //Observer fro LastMessage
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) setIsIntersecting(false)
    else {
      setIsIntersecting(true)
      setUnreadCount(0)
    }
  }, { threshold: 0 })

  //Check if LastMessage exists and start observing the latest one
  useEffect(() => {
    const lastMessageDiv = messages.length != 0 && lastMessageRef.current
    if (!lastMessageDiv) return
    observer.observe(lastMessageDiv)
  }, [messages])

  //Run for every non-first(i.e. exclude initial render) message
  useEffect(() => {
    if (!lastMessage) return

    if (lastMessage.author._id != user?._id && !isIntersecting) {
      setUnreadCount(count => count + 1)
      ping.play()
    }
    else scrollToBottom(messagesRef)
  }, [lastMessage])

  //Get Group data
  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data } = await callAuthApi<{ group: Group }>('get', `/message/${groupId}`)
      if (data.success) {
        const { group } = data.data
        setGroup(group)
        setMessages([...group.messages])
        setLoading(false)
      }
      else console.error(data.message)
    })()
  }, [groupId])

  //Join ChatRoom
  useEffect(() => {
    if (loading) return
    socket.emit('JOIN_ROOM', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
      if (!res.success) toast.error('Error connecting to chatRoom')
    })
  }, [loading])

  //Receive ChatRoom Message
  useEffect(() => {
    socket.on('RECEIVE_MESSAGE_ON_CLIENT', (data) => {
      setMessages(prev => [...prev, data.message])
      setLastMessage(data.message)
    })
  }, [socket])



  //Send Message in ChatRoom
  const sendMessage = () => {
    socket.emit('SEND_MESSAGE_TO_SERVER', { text, roomId: groupId, userId: user?._id }, (res: { success: boolean, message: Message }) => {
      if (!res.success) return console.error(res.message)
      setMessages(prev => [...prev, res.message])
      setLastMessage(res.message)
    })
    setText('')
  }

  return (
    <div className={styles.chatAreaWrapper}>
      <ChatHeader group={group} groupId={groupId} />
      <Messages ref={messagesRef} lastMessageRef={lastMessageRef} messages={messages} loading={loading} user={user} />
      <MessageComposer sendMessage={sendMessage} setText={setText} text={text} />
      <ScrollToBottomButton containerRef={messagesRef} unreadCount={unreadCount} isIntersecting={isIntersecting} />
    </div>
  )
}

export default ChatArea
