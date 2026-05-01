import { useAuth } from '@/hooks/useAuth'
import styles from '../groupInfo.module.css'
import { Users } from 'lucide-react'
import clsx from 'clsx'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import type { Group, JoinRequest } from '../types'
import { ChatsCircleIcon } from '@phosphor-icons/react'
import { useRef, useState, type ChangeEvent, type RefObject } from 'react'
import CommentsSection from './CommentsSection'
import ShareMenuPopover from '@/components/Popovers/ShareMenuPopover'
import { normalizeError } from '@/utils/normalizeError'
import { toast } from 'sonner'
import ExpandableText from '@/components/ui/ExpandableText'
import ProfileDialog from '@/components/Dialogs/ProfileDialog/ProfileDialog'
import AvatarWrapper from '@/components/ui/AvatarWrapper'
import Spinner from '@/components/Loaders/Spinner'
import { getImgURL } from '@/lib/cloudinary'

const GroupInfoHero = () => {
    const { user } = useAuth()
    const { groupId } = useParams() as { groupId: string }
    const [currentSection, setCurrentSection] = useState<'Comments' | 'Members'>('Comments')
    const queryClient = useQueryClient()


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
    const avatarURL = getImgURL(group.avatar, 600)
    const firstLetter = group.title.charAt(0).toUpperCase()

    const inputRef = useRef<HTMLInputElement>(null)
    const avatarDialogRef = useRef<HTMLDialogElement>(null)

    const openDialog = (dialogRef: RefObject<HTMLDialogElement | null>) => {
        const dialog = dialogRef.current
        if (dialog) dialog.showModal()
    }

    const closeDialog = (dialogRef: RefObject<HTMLDialogElement | null>) => {
        const dialog = dialogRef.current
        if (dialog) dialog.close()
    }

    const resetFile = () => {
        const input = inputRef.current
        if (!input) return
        input.value = ''
    }

    const { mutate: uploadAvatarMutate, isPending: isUploadingAvatar } = useMutation({
        mutationFn: (formData: FormData) => api.patch<{ publicId: string, version: number }>(`/groups/${groupId}/avatar`, formData),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['groups', groupId], exact: true })
            queryClient.refetchQueries({ queryKey: ['groups'], exact: true })
            toast.success(`Photo ${group.avatar.publicId ? 'Changed' : 'Added'}`)
        },
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status >= 500) return
            toast.error('An error occurred', {
                description: err.message
            })
        },
        onSettled: () => {
            resetFile()
        }
    })

    const { mutate: removeAvatar, isPending: isRemovingAvatar } = useMutation({
        mutationFn: () => api.delete(`/groups/${groupId}/avatar`),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['groups', groupId], exact: true })
            queryClient.refetchQueries({ queryKey: ['groups'], exact: true })
            toast.success('Removal successful')
        },
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status >= 500) return
            toast.error('An error occurred', {
                description: err.message
            })
        },
    })

    const uploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || !files[0] || !files[0].type.startsWith('image/')) return toast.error('An error occurred', {
            description: "File is invalid/empty"
        })

        const file = files[0]

        if (file.size > 8 * 1024 * 1024) {
            resetFile()
            return toast.error('An error occurred', {
                description: "File cannot be larger than 8 Mb"
            })
        }

        closeDialog(avatarDialogRef)

        const formData = new FormData()
        formData.append('group-avatar', file)
        uploadAvatarMutate(formData)
    }

    const isUpdatingAvatar = isUploadingAvatar || isRemovingAvatar

    return (
        <div data-sidebar-type='overlay' className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.heroWrapper}>

                    <div className={styles.header}>
                        <AvatarWrapper asChild avatarURL={''} className={styles.avatarWrapper}>
                            <button onClick={() => openDialog(avatarDialogRef)} >
                                {avatarURL ? <img src={avatarURL} alt="group-avatar" /> : firstLetter}
                                {isUpdatingAvatar &&
                                    <div className={styles.spinnerWrapper}>
                                        <Spinner className={clsx(styles.spinner)} />
                                    </div>}
                            </button>
                        </AvatarWrapper>
                        <dialog ref={avatarDialogRef} className={styles.avatarDialog}>
                            <div>
                                <h2 className={styles.avatarDialogHeading}>Change Profile Photo</h2>
                                <div className={styles.changeAvatarOptions}>
                                    <input ref={inputRef} onChange={uploadAvatar} id='group-avatar-input' accept='image/*' type="file" style={{ display: 'none' }} />
                                    <label role='button' style={{ color: 'var(--primary-darker)' }} htmlFor='group-avatar-input'>Upload Photo</label>
                                    <button onClick={() => {
                                        if (!group.avatar.publicId) return toast.error("Nothing to remove", {
                                            description: "You do not have an avatar"
                                        })
                                        closeDialog(avatarDialogRef)
                                        removeAvatar()
                                    }} style={{ color: 'hsl(0, 88%, 57%)' }}>Remove Current Photo</button>
                                    <button onClick={() => closeDialog(avatarDialogRef)}>Cancel</button>
                                </div>
                            </div>
                        </dialog>

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
                <h3 className={styles.rightSidebarHeading}>Members</h3>
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
                    <ProfileDialog avatarClassName={styles.avatarWrapper} user={member} key={member._id} className={styles.member}>
                        <div className={styles.memberDetails}>
                            <span>{member.fullName}</span>
                            <span>{member.username}</span>
                        </div>
                    </ProfileDialog>
                )
            })}

        </div>
    )
}


