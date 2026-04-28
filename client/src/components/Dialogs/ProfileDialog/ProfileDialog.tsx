import { useEffect, useRef, type ReactNode } from 'react'
import styles from './profileDialog.module.css'
import { getImgURL } from '@/lib/cloudinary'
import AvatarWrapper from '@/components/ui/AvatarWrapper'
import { X } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'

type ProfileDialogProps = {
    user: {
        avatar: {
            publicId: string,
            version: number
        },
        username: string,
        fullName: string,
        createdAt: string,
        email: string,
        memberGroup: string[]
    },
    className?: string,
    avatarClassName: string,
    children?: ReactNode
}

const ProfileDialog = ({ user, className, children, avatarClassName }: ProfileDialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null)


    const avatarURL = user && getImgURL(user.avatar, 400)
    const firstLetter = user?.fullName.charAt(0)


    const toggleDialog = () => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (dialog.open) dialog.close()
        else dialog.showModal()
    }

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        const eventHandler = (e: PointerEvent, dialog: HTMLDialogElement) => {
            const dialogDimensions = dialog.getBoundingClientRect()
            if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) dialog.close()

        }
        dialog.addEventListener('click', (e) => eventHandler(e, dialog))

        return () => {
            dialog.removeEventListener('click', (e) => eventHandler(e, dialog))
        }
    }, [])

    const formattedDate = user && new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(user.createdAt))


    return (
        user && <>
            <button className={className} onClick={() => toggleDialog()} aria-label="View your profile">
                <AvatarWrapper className={avatarClassName} avatarURL={avatarURL}>
                    {avatarURL ? <img src={avatarURL} alt="user-avatar" /> : firstLetter}
                </AvatarWrapper>
                {children}
            </button>


            <dialog ref={dialogRef} className={styles.profileDialog}>
                <div>
                    <button aria-label='close profile dialog' className={styles.closeDialogBtn} onClick={() => toggleDialog()}>
                        <X strokeWidth={1.5} size={20} />
                    </button>
                    <div className={styles.profileArea}>
                        <div className={styles.profileHeader}>
                            <Avatar avatar={user?.avatar ?? { publicId: '', version: 0 }} alt='user-avatar' imgSize={400} title={'goga'} className={styles.avatarWrapper} />
                            <div className={styles.profileHeaderDetails}>
                                <h2>{user.username}</h2>
                                <span>{user.fullName}</span>
                            </div>
                        </div>

                        <div className={styles.profileMainArea}>
                            <div>
                                <h3>Email</h3>
                                <span>{user.email}</span>
                            </div>
                            <div>
                                <h3>Member Since</h3>
                                <span>
                                    {formattedDate}
                                </span>
                            </div>
                            <div>
                                <h3>Associated Groups</h3>
                                <span>{user.memberGroup.length}</span>
                            </div>
                        </div>

                        <div className={styles.profileFooter}>
                            <button>Coming Soon</button>
                            <button>Coming Soon</button>
                        </div>
                    </div >
                </div>
            </dialog >
        </>
    )
}

export default ProfileDialog
