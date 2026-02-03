import GroupInfoHero from './GroupInfoHero'
import CommentsSection from './CommentsSection'
import mystyle from '../groupInfo.module.css'
import { useQuery } from '@tanstack/react-query'
import type { Group } from '../types'
import { api } from '@/api/axios'
import LoadingPage from '@/app/pages/Extras/LoadingPage'
import { Navigate, useParams } from 'react-router-dom'

const GroupInfoFeature = () => {

    const { groupId } = useParams()

    const { isError, isPending, data: group } = useQuery({
        queryKey: ['groups', groupId],
        queryFn: () => api.get<{ group: Group }>(`/groups/${groupId}`),
        select: (res) => res.data.group
    })

    if (isPending) return <LoadingPage />
    if (isError) return <Navigate to={'/NotFound'} />

    
    return (
        <div className={mystyle.wrapper}>
            <GroupInfoHero group={group} />
            <div className={mystyle.line}></div>
            <CommentsSection group={group} groupId={groupId} />
        </div>
    )
}

export default GroupInfoFeature
