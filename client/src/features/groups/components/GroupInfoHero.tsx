import { useAuth } from '@/hooks/useAuth'
import styles from '../groupInfo.module.css'
import { getImgURL } from '@/lib/cloudinary'
import { Users } from 'lucide-react'
import clsx from 'clsx'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import type { Group } from '../types'
import { ChatsCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import CommentsSection from './CommentsSection'
import { useReadMore } from '../hooks/useReadMore'
import ShareMenuPopover from '@/components/Popovers/ShareMenuPopover'

const GroupInfoHero = () => {
    const { user } = useAuth()
    const { groupId } = useParams() as { groupId: string }
    const { paragraphRef, readMoreRef } = useReadMore()

    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 600)

    const { data: group } = useSuspenseQuery({
        queryKey: ['groups', groupId],
        queryFn: () => api.get<{ group: Group }>(`/groups/${groupId}`),
        select: (res) => res.data.group
    })


    const [currentSection, setCurrentSection] = useState<'Comments' | 'Members'>('Comments')


    return (
        <div data-sidebar-type='overlay' className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.heroWrapper}>

                    <div className={styles.header}>
                        <div style={{ fontSize: '48px' }} className={styles.avatarWrapper}>
                            {/* ###LATER CHANGE */}
                            {url ? <img src={url} alt="group-avatar" /> : group.title.charAt(0)}
                        </div>
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
                        <p ref={paragraphRef} className={styles.description}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat aperiam, eos temporibus velit excepturi aliquid inventore suscipit cupiditate doloribus provident rerum, possimus aliquam quo laudantium. Eligendi obcaecati, nihil sunt sed, culpa enim quod eum quia rem ex delectus, aliquid dolorem explicabo optio cum recusandae unde. Tenetur alias deleniti numquam unde?
                        </p>
                        <input type="checkbox" id="toggleMoreDescription" />
                        <label ref={readMoreRef} htmlFor="toggleMoreDescription" className={styles.toggleMoreContent} />
                    </div>
                    <div className={styles.groupInteractionButtons}>
                        {group.member.some(e => e._id == user?._id) ?
                            <Link className={clsx(styles.primaryButton, styles.groupInteractionButton)} to={`/groups/${groupId}/chats`}>Chat now</Link>
                            :
                            <button aria-label='send request' disabled={group.incomingRequests.includes(user?._id ?? '')} className={clsx(styles.primaryButton, styles.groupInteractionButton)}>Send Request</button>
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
                const url = member.avatar.publicId && getImgURL(member.avatar.publicId, member.avatar.version, 600)

                return (
                    <Link key={member._id} to={`/travellers/${member._id}`} className={styles.member}>
                        <div className={clsx(styles.avatarWrapper, !url && styles.emptyAvatar)}>
                            {url ? <img src={url} alt='member-avatar' /> : member.fullName.charAt(0)}
                        </div>
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


