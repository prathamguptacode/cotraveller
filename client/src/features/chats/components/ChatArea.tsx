import styles from '../chats.module.css'
import { useParams } from 'react-router-dom'
import Messages from './Messages'
import MessageComposer from './MessageComposer'
import ScrollToBottomButton from './ScrollToBottomButton'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { ConversationRecord, Group, Message } from '../types'
import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { useAutoScroll } from '../hooks/useAutoScroll'
import ChatHeader from './ChatHeader'
import { type InfiniteData, useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useLastMessageObserver } from '../hooks/useLastMessageObserver'
import { api } from '@/api/axios'
import { messagesInfiniteQueryOptions, messagesKeys } from '../queries'
import type { ApiSuccess } from '@/types/api.types'

// ###BUG Navbar multimount issue creating multiple toasts upon SSE




const ChatArea = () => {
  const queryClient = useQueryClient()
  const { groupId } = useParams() as { groupId: string }
  const { user } = useAuth()
  const socket = useSocket()


  const [unreadCount, setUnreadCount] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(true)


  const [text, setText] = useState('')
  const lastMessageRef = useRef<HTMLDivElement>(null)


  const { data: { group, conversationRecords } } = useSuspenseQuery({
    queryKey: ['groups', groupId],
    queryFn: () => api.get<{ group: Group, conversationRecords: ConversationRecord[] }>(`/groups/${groupId}`),
    select: (res) => res.data
  })




  //Get Group data
  const { data: { messages, pagination }, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(groupId))




  useAutoScroll(messages[messages.length - 1], isAtBottom, lastMessageRef, setUnreadCount)
  useLastMessageObserver(group, setIsAtBottom, setUnreadCount, lastMessageRef)

  useEffect(() => {
    //Join ChatRoom
    socket.emit('JOIN_ROOM', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
      if (!res.success) toast.error('Error connecting to chatRoom')
    })

    //Receive ChatRoom Message
    const receiveMessage = (data: { message: Message }) => {
      queryClient.setQueryData<InfiniteData<ApiSuccess<{ messages: Message[] }>>>(messagesKeys.infinite(groupId), (prev) => {
        if (!prev) return prev
        const messages = [...prev.pages[0].data.messages]
        messages.push(data.message)
        return { ...prev, pages: [{ ...prev.pages[0], data: { ...prev.pages[0].data, messages } }, ...prev.pages.slice(1)] }
      })
      if (!document.hasFocus()) return

      socket.emit('MESSAGE_READ_TO_SERVER', { roomId: groupId, userId: user?._id, readAt: Date.now() })
    }
    const refreshReadStatus = (data: { conversationRecord: ConversationRecord }) => {
      queryClient.setQueryData<ApiSuccess<{ group: Group, conversationRecords: ConversationRecord[] }>>(['groups', groupId], (prev) => {
        if (!prev) return prev
        const conversationRecords = prev.data.conversationRecords.map(record => {
          //updating the conversationRecord for whatever user's record is received in data from socket
          if (record.memberId == data.conversationRecord.memberId) return { ...record, lastReadAt: data.conversationRecord.lastReadAt }
          return record
        })
        return { ...prev, data: { ...prev.data, conversationRecords } }
      })
    }

    socket.on('RECEIVE_MESSAGE_ON_CLIENT', receiveMessage)
    socket.on('MESSAGE_READ_TO_CLIENT', refreshReadStatus)



    return () => {
      socket.off('RECEIVE_MESSAGE_ON_CLIENT', receiveMessage)
      socket.off('MESSAGE_READ_TO_CLIENT', refreshReadStatus)
    }

  }, [socket, groupId, queryClient, user?._id])



  useEffect(() => {
    const event = () => {
      socket.emit('MESSAGE_READ_TO_SERVER', { roomId: groupId, userId: user?._id, readAt: Date.now() })
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
    }
    event()
    window.addEventListener('focus', event)
    window.addEventListener('focusout', event)
    return () => {
      window.removeEventListener('focus', event)
      window.removeEventListener('focusout', event)
    }
  }, [groupId, queryClient, user?._id, socket])








  //Send Message in ChatRoom
  const sendMessage = () => {
    socket.emit('SEND_MESSAGE_TO_SERVER', { text, roomId: groupId, userId: user?._id }, (res: { success: boolean, message: Message }) => {
      if (!res.success) return console.error('umm message error hua')
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })

      queryClient.setQueryData<InfiniteData<ApiSuccess<{ messages: Message[] }>>>(messagesKeys.infinite(groupId), (prev) => {
        if (!prev) return prev
        const messages = [...prev.pages[0].data.messages]
        messages.push(res.message)
        return { ...prev, pages: [{ ...prev.pages[0], data: { ...prev.pages[0].data, messages } }, ...prev.pages.slice(1)] }
      })
    })
    setText('')
  }

  return (
    <div className={styles.chatAreaWrapper}>
      <ChatHeader group={group} groupId={groupId} />
      <Messages key={groupId} lastMessageRef={lastMessageRef} messages={messages} conversationRecords={conversationRecords} />
      <MessageComposer sendMessage={sendMessage} setText={setText} text={text} />
      <ScrollToBottomButton lastMessageRef={lastMessageRef} unreadCount={unreadCount} isAtBottom={isAtBottom} />
    </div>
  )
}

export default ChatArea




