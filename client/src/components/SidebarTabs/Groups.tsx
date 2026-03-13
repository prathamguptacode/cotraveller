import styles from './tabs.module.css'
import { Link } from 'react-router-dom'
import { api } from '@/api/axios'
import { FaPeopleGroup } from "react-icons/fa6";
import type { Group } from '@/types/group.types'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Info, MessageSquare } from 'lucide-react';


const Groups = () => {
  const socket = useSocket()
  const { user } = useAuth()
  const queryClient = useQueryClient()




  const { data: groups } = useSuspenseQuery({
    queryKey: ['groups'],
    staleTime: Infinity,
    queryFn: () => api.get<{ groups: Group[] }>('/user/groups'),
    select: (res) => res.data.groups
  })

  useEffect(() => {
    socket.emit('JOIN_ROOM', { userId: user?._id, roomId: `user_room_${user?._id}` }, ((res: { success: boolean }) => {
      if (!res.success) console.debug('Socket connection for All chats failed')
    }))

    socket.on('UPDATE_MESSAGE_ON_CLIENT', () => queryClient.invalidateQueries({ queryKey: ['groups'] })
    )
  }, [socket])


  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link to={`/groups/${group._id}/chats`} key={group._id} className={styles.listItem}>
              <div className={styles.avatarWrapper} >
                <FaPeopleGroup />
              </div>
              <div className={styles.detailsWrapper}>
                <p className={styles.groupName}>{group.title}</p>
                {group.lastMessage && <p className={styles.lastMessage}>{group.lastMessage.author} : {group.lastMessage.text}</p>}
              </div>
              <div className={styles.choicesWrapper}>
                <Link to={`/groups/${group._id}/chats`}>
                  <MessageSquare size={20} />
                </Link>
                <Link to={`/groups/${group._id}`}>
                  <Info size={20} />
                </Link>
              </div>
            </Link>
          )
        })
      }

    </div>

  )
}

export default Groups
