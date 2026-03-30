import styles from '../sidebarChatsPreview.module.css'
import { Link, NavLink } from 'react-router-dom'
import { api } from '@/api/axios'
import type { Group } from '@/types/group.types'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MountainSnow, Users } from 'lucide-react';
import clsx from 'clsx';
import { useMainLayoutContext } from '@/app/layouts/MainLayout/useMainLayout';



const SidebarChatsPreview = () => {
    const socket = useSocket()
    const { user } = useAuth()
    const { setNotifications } = useMainLayoutContext()
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    useEffect(() => {
        if (groups.some(group => group.unreadMessagesCount > 0)) setNotifications(prev => ({ ...prev, Chats: true }))
        else setNotifications(prev => ({ ...prev, Chats: false }))
    }, [groups, setNotifications])



    return (
        groups.length == 0 ?
            <div className={styles.fallbackWrapper}>
                {/* ###LATER Replace this fallback */}
                <MountainSnow size={48} />
                Find your first group now !
                <Link to={`/viewgroup?q=VIT%20Chennai&mode=Airplane&lowerT=2025-12-20T00:00&upperT=2025-12-20T23:59&d=20&m=December&y=2025`} className={styles.redirectButton} >Go</Link>
            </div> :
            <div className={styles.list}>
                {
                    groups.map(group => {
                        return (
                            <NavLink to={`/groups/${group._id}/chats`} key={group._id} className={({ isActive }) => clsx(isActive && styles.activeItem, styles.listItem)
                            }>
                                <div className={styles.avatarWrapper} >
                                    <Users size={20} />
                                </div>
                                <div className={styles.detailsWrapper}>
                                    <p className={styles.groupName}>{group.title}</p>
                                    {group.lastMessage && <p className={styles.lastMessage}>{group.lastMessage.author} : {group.lastMessage.text}</p>}
                                </div>
                                <div className={styles.choicesWrapper}>
                                    {group.unreadMessagesCount > 0 && < div className={styles.unreadCount}>{group.unreadMessagesCount}</div>}
                                </div>
                            </NavLink>
                        )
                    })
                }

            </div >

    )
}

export default SidebarChatsPreview