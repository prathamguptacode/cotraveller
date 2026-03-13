import styles from '../chats.module.css'
import { useParams } from 'react-router-dom'
import Messages from './Messages'
import MessageComposer from './MessageComposer'
import ScrollToBottomButton from './ScrollToBottomButton'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Group, Message } from '../types'
import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { useAutoScroll } from '../hooks/useAutoScroll'
import ChatHeader from './ChatHeader'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useLastMessageObserver } from '../hooks/useLastMessageObserver'
import { api } from '@/api/axios'

const ChatArea = () => {
  const queryClient = useQueryClient()
  const { groupId } = useParams() as { groupId: string }
  const { user } = useAuth()
  const socket = useSocket()


  const [unreadCount, setUnreadCount] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(true)


  const [text, setText] = useState('')
  const lastMessageRef = useRef<HTMLDivElement>(null)


  //Get Group data
  const { data: group } = useSuspenseQuery({
    queryKey: ['groups', groupId, 'chats'],
    queryFn: () => api.get<{ group: Group }>(`/message/${groupId}`),
    staleTime: Infinity,
    select: (res) => {
      const group = res.data.group
      return group
    }
  })


  useAutoScroll(group.messages[group.messages.length - 1], isAtBottom, lastMessageRef, setUnreadCount)
  useLastMessageObserver(group, setIsAtBottom, setUnreadCount, lastMessageRef)

  useEffect(() => {
    //Join ChatRoom
    socket.emit('JOIN_ROOM', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
      if (!res.success) toast.error('Error connecting to chatRoom')
    })

    //Receive ChatRoom Message
    socket.on('RECEIVE_MESSAGE_ON_CLIENT', (data) => {
      queryClient.setQueryData(['groups', groupId, 'chats'], (prev: { data: { group: Group } }) => {
        const group = prev.data.group
        return { ...prev, data: { ...prev.data, group: { ...group, messages: [...group.messages, data.message] } } }

      })
      socket.emit('MESSAGE_READ_TO_SERVER', { roomId: groupId, userId: user?._id, readAt: Date.now() })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, groupId])





  //Send Message in ChatRoom
  const sendMessage = () => {
    socket.emit('SEND_MESSAGE_TO_SERVER', { text, roomId: groupId, userId: user?._id }, (res: { success: boolean, message: Message }) => {
      if (!res.success) return console.error('umm message error hua')
      queryClient.invalidateQueries({ queryKey: ['groups'] })

      queryClient.setQueryData(['groups', groupId, 'chats'], (prev: { data: { group: Group } }) => {
        const group = prev.data.group
        return { ...prev, data: { ...prev.data, group: { ...group, messages: [...group.messages, res.message] } } }
      })
    })
    setText('')
  }

  return (
    <div className={styles.chatAreaWrapper}>
      <ChatHeader group={group} groupId={groupId} />
      <Messages key={groupId} lastMessageRef={lastMessageRef} messages={group.messages} />
      <MessageComposer sendMessage={sendMessage} setText={setText} text={text} />
      <ScrollToBottomButton lastMessageRef={lastMessageRef} unreadCount={unreadCount} isAtBottom={isAtBottom} />
    </div>
  )
}

export default ChatArea
