import { useAuth } from '@/hooks/useAuth'
import styles from '../groupInfo.module.css'
import { getImgURL } from '@/lib/cloudinary'
import { Bus, Car, DotIcon, LucideCarTaxiFront, Map, Motorbike, Plane, Train, Users, X } from 'lucide-react'
import clsx from 'clsx'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import type { Group } from '../types'
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, WhatsappIcon, WhatsappShareButton, XIcon, XShareButton } from 'react-share'
import { ChatsCircleIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useEffect, useState, type JSX } from 'react'
import CommentsSection from './CommentsSection'
import { useMainLayoutContext } from '@/app/layouts/MainLayout/useMainLayout'

const GroupInfoHero = () => {
    const { user } = useAuth()
    const { setSidebarIsHidden } = useMainLayoutContext()
    const { groupId } = useParams() as { groupId: string }

    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 600)

    const { data: group } = useSuspenseQuery({
        queryKey: ['groups', groupId],
        queryFn: () => api.get<{ group: Group }>(`/groups/${groupId}`),
        select: (res) => res.data.group
    })


    const shareURL = new URL(location.pathname, location.origin).href
    const copyShareLink = () => {
        navigator.clipboard.writeText(shareURL)
        toast.success("Link copied to clipboard")
    }


    const [currentSection, setCurrentSection] = useState<'Comments' | 'Members' | 'Travel Details'>(() => {
        if (window.matchMedia("(max-width:1240px)").matches) return 'Travel Details'
        return 'Comments'
    })
    const [currentRightSidebarTab, setCurrentRightSidebarTab] = useState<'Travel Details' | 'Members'>('Travel Details')

    useEffect(() => {
        setSidebarIsHidden(true)
    }, [])



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
                        </div>

                    </div>




                    <div className={styles.descriptionWrapper}>
                        <p className={styles.description}>
                            {group.content}
                        </p>
                        <input type="checkbox" id="toggleMoreDescription" />
                        <label htmlFor="toggleMoreDescription" className={styles.toggleMoreContent} />
                    </div>
                    <div className={styles.groupInteractionButtons}>
                        {group.member.some(e => e._id == user?._id) ?
                            <Link className={clsx(styles.primaryButton, styles.groupInteractionButton)} to={`/groups/${groupId}/chats`}>Chat now</Link>
                            :
                            <button aria-label='send request' disabled={group.incomingRequests.includes(user?._id ?? '')} className={clsx(styles.primaryButton, styles.groupInteractionButton)}>Send Request</button>
                        }
                        <button popoverTargetAction='show' popoverTarget='shareMenu' aria-label='share group link' className={clsx(styles.secondaryButton, styles.groupInteractionButton)}>Share</button>
                        <div popover='auto' id='shareMenu' className={styles.shareMenu}>
                            <header className={styles.shareMenuHeader}>
                                Share <button popoverTarget='shareMenu' popoverTargetAction='hide'>
                                    <X />
                                </button>
                            </header>
                            <div className={styles.shareOptions}>
                                <div>
                                    <WhatsappShareButton aria-label='share link to Whatsapp' url={shareURL}>
                                        <WhatsappIcon />
                                    </WhatsappShareButton>
                                    Whatsapp
                                </div>
                                <div>
                                    <FacebookShareButton title={group.title} aria-label='share link to Facebook' url={shareURL}>
                                        <FacebookIcon />
                                    </FacebookShareButton>
                                    Facebook
                                </div>
                                <div>
                                    <XShareButton title={group.title} aria-label='share link to X' url={shareURL}>
                                        <XIcon />
                                    </XShareButton>
                                    X
                                </div>
                                <div>
                                    <EmailShareButton title={group.title} aria-label='share link to EmailShareButton' url={shareURL}>
                                        <EmailIcon />
                                    </EmailShareButton>
                                    Email
                                </div>
                                <div>
                                    <RedditShareButton title={group.title} aria-label='share link to Reddit' url={shareURL}>
                                        <RedditIcon />
                                    </RedditShareButton>
                                    Reddit
                                </div>
                                <div>
                                    <LinkedinShareButton title={group.title} aria-label='share link to Linkedin' url={shareURL}>
                                        <LinkedinIcon />
                                    </LinkedinShareButton>
                                    Linkedin
                                </div>
                            </div>
                            <div className={styles.copyLinkArea}>
                                <input type="text" readOnly value={shareURL} />
                                <button onClick={copyShareLink} className={styles.copyLinkButton}>Copy</button>
                            </div>
                        </div>
                    </div>



                </div>
                <nav className={styles.sectionSwitchersWrapper}>
                    <div className={styles.sectionSwitchers}>
                        <button onClick={() => setCurrentSection('Travel Details')} aria-label='Show Travel Details' className={clsx(styles.sectionSwitcher, currentSection == 'Travel Details' && styles.activeSectionSwitcher)}>
                            <Map size={24} />
                        </button>
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
                        currentSection == 'Members' ? <Members group={group} /> :
                            currentSection == 'Travel Details' ? <TravelDetails group={group} /> :
                                <div>Nothing here</div>
                    }
                </div>
            </div >
            <div className={styles.rightSidebar}>
                <nav className={styles.sectionSwitchersWrapper}>
                    <div className={styles.sectionSwitchers}>
                        <button onClick={() => setCurrentRightSidebarTab('Travel Details')} aria-label='Show travel details' className={clsx(styles.sectionSwitcher, currentRightSidebarTab == 'Travel Details' && styles.activeSectionSwitcher)}>
                            <Map size={24} />
                        </button>
                        <button onClick={() => setCurrentRightSidebarTab('Members')} aria-label='show members section' className={clsx(styles.sectionSwitcher, currentRightSidebarTab == 'Members' && styles.activeSectionSwitcher)}>
                            <Users size={24} />
                        </button>
                    </div>
                    <div className={styles.activeSectionIndicator}></div>
                </nav>
                <div className={styles.sectionWrapper}>
                    <section className={styles.rightSidebarSection}>
                        <header className={styles.rightSidebarHeader}>
                            <h2 className={styles.rightSidebarHeading}>{currentRightSidebarTab}</h2>
                        </header>

                        {currentRightSidebarTab === 'Travel Details' ?
                            <TravelDetails group={group} /> :
                            <Members group={group} />}

                    </section>

                </div>
            </div>
        </div>

    )
}

export default GroupInfoHero



type TravelDetailsProps = {
    group: Group
}

const TravelDetails = ({ group }: TravelDetailsProps) => {
    const transportationIcon = { 'Airplane': <Plane />, 'Flight': <Plane />, 'Car': <Car />, 'Taxi': <LucideCarTaxiFront />, 'Train': <Train />, 'Railway': <Train />, 'Bus': <Bus />, 'Bike': <Motorbike />, 'Other': <Map /> } as Record<string, JSX.Element>

    const dateTime = new Date(group.travelDate)
    const dateAndDay = new Intl.DateTimeFormat('en-gb', {
        dateStyle: 'full',
    }).format(dateTime)

    const time = new Intl.DateTimeFormat('en-gb', {
        timeStyle: 'short',
        hour12: true,
    }).format(dateTime)
    return (
        <div className={styles.travelDetailsArea}>
            <div className={styles.travelLane}>
                <DotIcon size={40} />
                <div></div>
                {transportationIcon[group.mode]}
                <div></div>
                <DotIcon size={40} />
            </div>
            <div className={styles.travelDetailsWrapper}>
                <div className={styles.travelDetails}>
                    <span>{group.intialLocation}</span>
                    <span>{dateAndDay}</span>
                    <span>{time}</span>
                </div>
                <div className={styles.travelDetails}>
                    <span>Las Vegas</span>
                </div>
            </div>
        </div>
    )
}


type MembersProps = {
    group: Group
}

const Members = ({ group }: MembersProps) => {
    const { user } = useAuth()
    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 600)
    return (
        <div className={styles.members}>
            <Link to={`/travellers/${group.member[0]._id}`} className={styles.member}>
                <div className={styles.avatarWrapper}>
                    {url ? <img src={url} /> : 'S'}
                </div>
                <div className={styles.memberDetails}>
                    <span>Shubham Panjiyara</span>
                </div>
            </Link>
        </div>
    )
}