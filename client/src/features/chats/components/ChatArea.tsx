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
  const { data: { messages }, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(groupId))


  useAutoScroll(messages[messages.length - 1], isAtBottom, lastMessageRef, setUnreadCount)
  useLastMessageObserver(group, setIsAtBottom, setUnreadCount, lastMessageRef)

  useEffect(() => {

    //Join ChatRoom
    socket.emit('JOIN_ROOM', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
      if (!res.success) toast.error('Error connecting to chatRoom')
    })

    //Receive ChatRoom Message
    const receiveMessage = (data: { message: Message, roomId: string, group: Group }) => {
      queryClient.setQueryData<InfiniteData<ApiSuccess<{ messages: Message[] }>>>(messagesKeys.infinite(groupId), (prev) => {
        if (!prev) return prev
        const messages = [...prev.pages[0].data.messages]
        messages.push(data.message)
        return { ...prev, pages: [{ ...prev.pages[0], data: { ...prev.pages[0].data, messages } }, ...prev.pages.slice(1)] }
      })
      if (!document.hasFocus()) return

      socket.emit('MESSAGE_READ_TO_SERVER', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
        if (!res.success) return console.debug("Focus Callback failed")
        queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
      })
    }

    const refreshReadStatus = (data: { conversationRecord: ConversationRecord }) => {
      queryClient.setQueryData<ApiSuccess<{ group: Group, conversationRecords: ConversationRecord[] }>>(['groups', groupId], (prev) => {
        if (!prev) return prev
        const newConversationRecords = prev.data.conversationRecords.map(record => {
          if (record.memberId == data.conversationRecord.memberId) return { ...record, lastReadAt: data.conversationRecord.lastReadAt }
          return record
        })
        return { ...prev, data: { ...prev.data, conversationRecords: newConversationRecords } }
      })
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
    }

    socket.on('RECEIVE_MESSAGE_ON_CLIENT', receiveMessage)
    socket.on('MESSAGE_READ_TO_CLIENT', refreshReadStatus)



    return () => {
      socket.off('RECEIVE_MESSAGE_ON_CLIENT', receiveMessage)
      socket.off('MESSAGE_READ_TO_CLIENT', refreshReadStatus)
      //Leave ChatRoom
      socket.emit('LEAVE_ROOM', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
        if (!res.success) toast.error('Error disconnecting chatRoom')
      })
    }

  }, [socket, groupId, queryClient, user?._id])



  useEffect(() => {
    const event = () => {
      socket.emit('MESSAGE_READ_TO_SERVER', { roomId: groupId, userId: user?._id }, (res: { success: boolean }) => {
        if (!res.success) return console.debug("Focus Callback failed")
        queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
      })

    }
    event()
    window.addEventListener('focus', event)
    window.addEventListener('focusout', event)
    return () => {
      window.removeEventListener('focus', event)
      window.removeEventListener('focusout', event)
    }
  }, [groupId, queryClient, user?._id, socket])



  const messagesRef = useRef<HTMLDivElement>(null)
  const isFetchingNextPageRef = useRef<boolean>(false)
  const firstMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = messagesRef.current
    if (!hasNextPage || !container) return

    const scrollHandler = async () => {
      if (container.scrollTop < 1200 && !isFetchingNextPage && !isFetchingNextPageRef.current) {
        isFetchingNextPageRef.current = true
        await fetchNextPage()
        isFetchingNextPageRef.current = false
      }
    }

    container.addEventListener('scroll', scrollHandler)

    return () => container.removeEventListener('scroll', scrollHandler)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])







  //Send Message in ChatRoom
  const sendMessage = () => {
    console.log("Sending message to", groupId, group.title)
    socket.emit('SEND_MESSAGE_TO_SERVER', { text, roomId: groupId, userId: user?._id }, (res: { success: boolean, message: Message }) => {
      if (!res.success) return toast.error("Something went wrong!")
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
      <Messages firstMessageRef={firstMessageRef} messagesRef={messagesRef} key={groupId} lastMessageRef={lastMessageRef} messages={messages} conversationRecords={conversationRecords} />
      <MessageComposer sendMessage={sendMessage} setText={setText} text={text} />
      <ScrollToBottomButton lastMessageRef={lastMessageRef} unreadCount={unreadCount} isAtBottom={isAtBottom} />
    </div>
  )
}

export default ChatArea




