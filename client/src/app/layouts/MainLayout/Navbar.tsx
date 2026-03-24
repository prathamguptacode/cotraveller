import mystyle from './navbar.module.css'
import ThemeButton from '@/components/Buttons/ThemeButton';
import { Link } from 'react-router-dom';
import { useEffect, useRef, type ChangeEvent, type ReactNode, type RefObject } from "react";
import { Camera, Edit, Plus, TextAlignJustify, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import { useEventSource } from "@/hooks/useEventSource";
import { toast } from 'sonner';
import { getImgURL } from '@/lib/cloudinary';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { normalizeError } from '@/utils/normalizeError';
import Spinner from '@/components/Loaders/Spinner';
import { useMainLayoutContext } from './useMainLayout';



type EventType = {
    event: string,
    for: string,
}


type NavbarProps = {
    children: ReactNode
}


function Navbar({ children }: NavbarProps) {
    const { setNotifications } = useMainLayoutContext()
    const eventSource = useEventSource()

    useEffect(() => {
        const eventListener = (message: { data: string }) => {
            const data = JSON.parse(message.data) as unknown

            const isEvent = (data: unknown): data is EventType => {
                if (typeof data === 'object' && !Array.isArray(data)) return true
                return false
            }

            if (!isEvent(data)) return
            if (data.for === 'Inbox' && data.event === 'request_to_join_group:added') {
                toast.info('Request Alert', {
                    description: "Someone wants to join your group"
                })
                setNotifications(prev => ({ ...prev, Inbox: true }))
            }
        }
        eventSource.addEventListener('message', eventListener)

        return () => {
            eventSource.removeEventListener('message', eventListener)
        }
    }, [])




    // $$$please include profile picture feature
    //  AWWW ofc :)

    return (
        <div className={mystyle.navbar}>
            {children}
        </div>
    )
}

export default Navbar

const NavbarHamburger = () => {
    const { setSidebarIsHidden, notifications } = useMainLayoutContext()
    const { user } = useAuth()


    return user && <div role="button" tabIndex={0} onClick={() => setSidebarIsHidden(prev => !prev)} className={clsx(mystyle.hamburger, Object.values(notifications).some(e => e) && mystyle.notification)}>
        <TextAlignJustify strokeWidth={2.5} size={20} />
    </div>

}
Navbar.Hamburger = NavbarHamburger



const NavbarTitle = () => <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>
Navbar.Title = NavbarTitle

const NavbarThemeButton = () => <div className={mystyle.themebtn}><ThemeButton /></div>
Navbar.ThemeButton = NavbarThemeButton


const NavbarLoginButton = () => {
    const { user } = useAuth()

    return !user && <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>

}
Navbar.LoginButton = NavbarLoginButton

const NavbarCreateGroupButton = () => {
    return (
        <>
            <Link to={'/groups/create'} className={clsx(mystyle.navbtn, mystyle.createGroupBtn)}><Plus size={20} />Create Group</Link>
            <Link aria-label="Create Group" to={'/groups/create'} className={mystyle.plusBtn}><Plus size={20} /></Link>
        </>

    )
}
Navbar.CreateGroupButton = NavbarCreateGroupButton


const NavbarProfileButton = () => {
    const { user, updateUser } = useAuth()
    const profileDialogRef = useRef<HTMLDialogElement>(null)
    const avatarDialogRef = useRef<HTMLDialogElement>(null)

    const inputRef = useRef<HTMLInputElement>(null)

    const resetFile = () => {
        const input = inputRef.current
        if (!input) return
        input.value = ''
    }


    const url = user?.avatar.publicId && getImgURL(user.avatar.publicId, user.avatar.version, 400)
    const firstLetter = user?.fullName.charAt(0)



    const openDialog = (dialogRef: RefObject<HTMLDialogElement | null>) => {
        const dialog = dialogRef.current
        if (dialog) dialog.showModal()
    }

    const closeDialog = (dialogRef: RefObject<HTMLDialogElement | null>) => {
        const dialog = dialogRef.current
        if (dialog) dialog.close()
    }


    const uploadAvatarMutation = useMutation({
        mutationFn: (formData: FormData) => api.patch<{ publicId: string, version: number }>('/user/avatar', formData),
        onSuccess: (res) => {
            updateUser(prev => prev && ({ ...prev, avatar: res.data }))
            toast.success(`Photo ${user?.avatar.publicId ? 'Changed' : 'Added'}`)
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
        mutationFn: () => api.delete('/user/avatar'),
        onSuccess: (res) => {
            updateUser(prev => prev && ({ ...prev, avatar: { publicId: '', version: 0 } }))
            toast.success('Removal successful')
            console.log(res)
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
        formData.append('user-avatar', file)
        uploadAvatarMutation.mutate(formData)
    }






    useEffect(() => {
        const profileDialog = profileDialogRef.current
        const avatarDialog = avatarDialogRef.current
        if (!profileDialog || !avatarDialog) return

        const eventHandler = (e: PointerEvent, dialog: HTMLDialogElement) => {
            const dialogDimensions = dialog.getBoundingClientRect()
            if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) dialog.close()

        }
        profileDialog.addEventListener('click', (e) => eventHandler(e, profileDialog))
        avatarDialog.addEventListener('click', (e) => eventHandler(e, avatarDialog))

        return () => {
            profileDialog.removeEventListener('click', (e) => eventHandler(e, profileDialog))
            avatarDialog.removeEventListener('click', (e) => eventHandler(e, avatarDialog))
        }
    }, [])

    const formattedDate = user && new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(user.createdAt))

    return user &&
        <>
            <button onClick={() => openDialog(profileDialogRef)} className={mystyle.avatarWrapper} aria-label="View your profile">
                {url ? <img src={url} alt="user-avatar" /> : firstLetter}
                {
                    (uploadAvatarMutation.isPending || isRemovingAvatar) &&
                    <div className={mystyle.spinnerWrapper}>
                        <Spinner className={clsx(mystyle.spinner)} />
                    </div>
                }
            </button>

            <dialog ref={profileDialogRef} className={mystyle.profileDialog}>
                <div>
                    <button aria-label='close profile dialog' className={mystyle.closeDialogBtn} onClick={() => closeDialog(profileDialogRef)}>
                        <X strokeWidth={1.5} size={20} />
                    </button>
                    <div className={mystyle.profileArea}>
                        <div className={mystyle.profileHeader}>
                            <button disabled={uploadAvatarMutation.isPending || isRemovingAvatar} onClick={() => openDialog(avatarDialogRef)} aria-label='change profile picture' className={mystyle.avatarWrapper}>
                                {url ?
                                    <img src={url} alt="user-avatar" />
                                    : firstLetter}
                                {
                                    (uploadAvatarMutation.isPending || isRemovingAvatar) &&
                                    <div className={mystyle.spinnerWrapper}>
                                        <Spinner className={clsx(mystyle.spinner)} />
                                    </div>
                                }

                            </button>
                            <div className={mystyle.profileHeaderDetails}>
                                <h2>{user.username}</h2>
                                <span>{user.fullName}</span>
                            </div>
                        </div>

                        <div className={mystyle.profileMainArea}>
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

                        <div className={mystyle.profileFooter}>
                            <Link to={'#'} >
                                <Edit size={20} /> Edit Profile
                            </Link>
                            <button disabled={uploadAvatarMutation.isPending || isRemovingAvatar} onClick={() => openDialog(avatarDialogRef)} aria-label='change profile picture'>
                                <Camera size={20} /> {url ? 'Change' : 'Add'} Photo
                            </button>
                        </div>
                        <dialog ref={avatarDialogRef} className={mystyle.avatarDialog}>
                            <div>
                                <h2>Change Profile Photo</h2>
                                <div>
                                    <input ref={inputRef} onChange={uploadAvatar} id='avatarInput' accept='image/*' type="file" style={{ display: 'none' }} />
                                    <label role='button' style={{ color: 'var(--primary-darker)' }} htmlFor='avatarInput'>Upload Photo</label>
                                    <button onClick={() => {
                                        if (!user.avatar.publicId) return toast.error("Nothing to remove", {
                                            description: "You do not have an avatar"
                                        })
                                        closeDialog(avatarDialogRef)
                                        removeAvatar()
                                    }} style={{ color: 'rgb(240, 28, 28)' }}>Remove Current Photo</button>
                                    <button onClick={() => closeDialog(avatarDialogRef)}>Cancel</button>
                                </div>
                            </div>
                        </dialog>
                    </div >
                </div>
            </dialog >
        </>
}

Navbar.ProfileButton = NavbarProfileButton