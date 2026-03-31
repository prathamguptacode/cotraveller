import { useAuth } from '@/hooks/useAuth'
import styles from '../groupInfo.module.css'
import { getImgURL } from '@/lib/cloudinary'
import { Locate, MapPin, Plane, X } from 'lucide-react'
import clsx from 'clsx'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import type { Group } from '../types'
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, WhatsappIcon, WhatsappShareButton, XIcon, XShareButton } from 'react-share'
import { toast } from 'sonner'

const GroupInfoHero = () => {
    const { user } = useAuth()
    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 600)

    const { groupId } = useParams() as { groupId: string }
    const { data: group } = useSuspenseQuery({
        queryKey: ['groups', groupId],
        queryFn: () => api.get<{ group: Group }>(`/groups/${groupId}`),
        select: (res) => res.data.group
    })

    const shareURL = new URL(location.pathname, 'https://cotraveller.app').href

    const copyShareLink = () => {
        navigator.clipboard.writeText(shareURL)
        toast.success("Link copied to clipboard")
    }



    return (
        <div className={styles.wrapper} >
            <div className={styles.groupInfoAreaWrapper}>
                <div className={styles.heroWrapper}>

                    <div className={styles.header}>
                        <div className={styles.avatarWrapper}>
                            {/* ###LATER CHANGE */}
                            {url && <img src={url} alt="group-avatar" />}
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

                    {/* <p className={styles.description}>
                        We are a group of five looking for more people who really want to enjoy the cold and shivering winters of switzerland and behold the beauty of its lakes, we are looking forward to our next cotraveller :)
                    </p> */}
                    <div className={styles.travelDetailsWrapper}>
                        <span >
                            <Locate /> Roorkee
                        </span>
                        <div></div>

                        <span >
                            <Plane /> Flight
                        </span>
                        <div></div>
                        <span >
                            <MapPin /> Delhi
                        </span>
                    </div>


                </div>
                <div className={styles.commentsSection}>

                </div>
            </div>
            <div className={styles.membersArea}>

            </div>
        </div >
    )
}

export default GroupInfoHero
