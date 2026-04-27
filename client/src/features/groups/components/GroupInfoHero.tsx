import { useAuth } from '@/hooks/useAuth'
import styles from '../groupInfo.module.css'
import { Users } from 'lucide-react'
import clsx from 'clsx'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import type { Group, JoinRequest } from '../types'
import { ChatsCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import CommentsSection from './CommentsSection'
import ShareMenuPopover from '@/components/Popovers/ShareMenuPopover'
import { normalizeError } from '@/utils/normalizeError'
import { toast } from 'sonner'
import Avatar from '@/components/ui/Avatar'
import ExpandableText from '@/components/ui/ExpandableText'

const GroupInfoHero = () => {
    const { user } = useAuth()
    const { groupId } = useParams() as { groupId: string }
    const [currentSection, setCurrentSection] = useState<'Comments' | 'Members'>('Comments')


    const { data: group } = useSuspenseQuery({
        queryKey: ['groups', groupId],
        queryFn: () => api.get<{ group: Group }>(`/groups/${groupId}`),
        select: (res) => res.data.group
    })

    const { data: joinRequests, refetch: refetchJoinRequests } = useSuspenseQuery({
        queryKey: ['groups', groupId, 'requests'],
        queryFn: () => api.get<{ joinRequests: JoinRequest[] }>(`/groups/${groupId}/requests`),
        select: (res) => res.data.joinRequests
    })

    const { mutate: sendRequest, isPending: isSendingRequest } = useMutation({
        mutationFn: () => api.post(`/groups/${groupId}/requests`),
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status < 500) toast.error("An error occurred !", {
                description: err.message
            })
        },
        onSuccess: () => toast.success("Request Sent"),
        onSettled: () => refetchJoinRequests()
    })


    const hasRequested = joinRequests.some(request => request.requesterId == user?._id)



    return (
        <div data-sidebar-type='overlay' className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.heroWrapper}>

                    <div className={styles.header}>
                        <Avatar avatar={{ publicId: '', version: 0 }} imgSize={400} title={group.title} className={styles.avatarWrapper} alt='group-avatar' />
                        <div className={styles.headerDetails}>
                            <h2 className={styles.title}>
                                {group.title}
                            </h2>
                            <div className={styles.headerTravelDetails}>
                                <span>From: {group.intialLocation}</span>
                                <span>Departure: {new Intl.DateTimeFormat('en-gb', {
                                    timeStyle: 'short',
                                    hour12: true,
                                    dateStyle: 'long'
                                }).format(new Date(group.travelDate))} </span>
                                <span>Mode: {group.mode}</span>
                            </div>
                        </div>

                    </div>




                    <div className={styles.descriptionWrapper}>
                        <div className={styles.tags}>
                            <span className={styles.tag}>
                                Boys Only
                            </span>
                            <span className={styles.tag}>
                                No Alchohol
                            </span>
                            <span className={styles.tag}>
                                No Loud Music
                            </span>
                            <span className={styles.tag}>
                                Long Drive
                            </span>
                        </div>
                        <ExpandableText text={group.content} inputId='toggleMoreDescription' className={styles.description} />
                    </div>
                    <div className={styles.groupInteractionButtons}>
                        {group.member.some(e => e._id == user?._id) ?
                            <Link className={clsx(styles.primaryButton, styles.groupInteractionButton)} to={`/groups/${groupId}/chats`}>Chat now</Link>
                            :
                            <button onClick={() => user && sendRequest()} aria-label='send request' disabled={isSendingRequest || hasRequested} className={clsx(styles.primaryButton, styles.groupInteractionButton)}>
                                {hasRequested ? 'Request Sent' : 'Send Request'}
                            </button>
                        }
                        <button popoverTargetAction='show' popoverTarget='shareMenu' aria-label='share group link' className={clsx(styles.secondaryButton, styles.groupInteractionButton)}>Share</button>

                        <ShareMenuPopover title={group.title} />

                    </div>



                </div>
                <nav className={styles.sectionSwitchersWrapper}>
                    <div className={styles.sectionSwitchers}>
                        <button onClick={() => setCurrentSection('Comments')} aria-label='Show comments section' className={clsx(styles.sectionSwitcher, currentSection == 'Comments' && styles.activeSectionSwitcher)}>
                            <ChatsCircleIcon size={24} />
                        </button>
                        <button onClick={() => setCurrentSection('Members')} aria-label='show members section' className={clsx(styles.sectionSwitcher, currentSection == 'Members' && styles.activeSectionSwitcher)}>
                            <Users size={24} />
                        </button>
                    </div>
                    <div className={styles.activeSectionIndicator}></div>
                </nav>
                <div className={styles.sectionWrapper}>
                    {currentSection == 'Comments' ? <CommentsSection /> :
                        currentSection == 'Members' &&
                        <>
                            <h3 className={styles.membersHeading}>Members</h3>
                            <Members group={group} />
                        </>
                    }
                </div>
            </div >
            <div className={styles.rightSidebar}>
                <h3>Members</h3>
                <div className={styles.sectionWrapper}>
                    <section className={styles.rightSidebarSection}>
                        <Members group={group} />
                    </section>
                </div>
            </div>
        </div>

    )
}

export default GroupInfoHero





type MembersProps = {
    group: Group
}

const Members = ({ group }: MembersProps) => {
    return (
        <div className={styles.members}>
            {group.member.map(member => {
                return (
                    <Link key={member._id} to={`/travellers/${member._id}`} className={styles.member}>
                        <Avatar avatar={member.avatar} imgSize={400} title={member.fullName} className={styles.avatarWrapper} alt='member-avatar' />
                        <div className={styles.memberDetails}>
                            <span>{member.fullName}</span>
                            <span>{member.username}</span>
                        </div>
                    </Link>
                )
            })}

        </div>
    )
}


