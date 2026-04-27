import mystyle from './navbar.module.css'
import ThemeButton from '@/components/Buttons/ThemeButton';
import { Link } from 'react-router-dom';
import { useEffect, useRef, type ChangeEvent, type ReactNode, type RefObject } from "react";
import { ArrowLeft, Camera, Plus, TextAlignJustify, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import { useEventSource } from "@/hooks/useEventSource";
import { toast } from 'sonner';
import { getImgURL } from '@/lib/cloudinary';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { normalizeError } from '@/utils/normalizeError';
import Spinner from '@/components/Loaders/Spinner';
import { useMainLayoutContext } from './useMainLayout';
import LogOutButton from '@/components/Buttons/LogOutButton';
import AvatarWrapper from '@/components/ui/AvatarWrapper';



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
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { data: groupJoinRequestsCount } = useQuery({
        queryKey: ['inbox', 'status'],
        queryFn: () => api.get<{ groupJoinRequestsCount: number }>('/user/inbox/status'),
        select: (res) => res.data.groupJoinRequestsCount,
        refetchInterval: 1000 * 5 * 60,
        enabled: !!user
    })


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
                queryClient.invalidateQueries({ queryKey: ['inbox'], exact: true })
            }
        }
        eventSource.addEventListener('message', eventListener)

        return () => {
            eventSource.removeEventListener('message', eventListener)
        }
    }, [])


    useEffect(() => {
        if (!groupJoinRequestsCount) return
        setNotifications(prev => ({ ...prev, Inbox: groupJoinRequestsCount > 0 }))
    }, [groupJoinRequestsCount])



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
    const { setSidebarIsHidden, notifications, hamburgerRef, sidebarIsHidden } = useMainLayoutContext()


    return <button ref={hamburgerRef} aria-label='hamburger menu' tabIndex={0} onClick={() => setSidebarIsHidden(prev => !prev)} className={clsx(mystyle.hamburger, Object.values(notifications).some(e => e) && mystyle.notification, !sidebarIsHidden && mystyle.mobileBackButton)}>
        <TextAlignJustify strokeWidth={2.5} size={20} />
        <ArrowLeft strokeWidth={2.5} size={20} />
    </button>

}
Navbar.Hamburger = NavbarHamburger



const NavbarTitle = () => {
    return (
        <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>
    )
}
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
            <Link role='button' to={'/groups/create'} className={clsx(mystyle.navbtn, mystyle.createGroupBtn)}><Plus size={20} />Create Group</Link>
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


    const avatarURL = user && getImgURL(user.avatar, 400)
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
        onSuccess: () => {
            updateUser(prev => prev && ({ ...prev, avatar: { publicId: '', version: 0 } }))
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

    const formattedDate = user && new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(user.createdAt))

    return user &&
        <>
            <AvatarWrapper asChild avatarURL={avatarURL} className={mystyle.avatarWrapper}>
                <button onClick={() => openDialog(profileDialogRef)} aria-label="View your profile">
                    {avatarURL ? <img src={avatarURL} alt="user-avatar" /> : firstLetter}
                    {(uploadAvatarMutation.isPending || isRemovingAvatar) &&
                        <div className={mystyle.spinnerWrapper}>
                            <Spinner className={clsx(mystyle.spinner)} />
                        </div>}
                </button>
            </AvatarWrapper>

            <dialog ref={profileDialogRef} className={mystyle.profileDialog}>
                <div>
                    <button aria-label='close profile dialog' className={mystyle.closeDialogBtn} onClick={() => closeDialog(profileDialogRef)}>
                        <X strokeWidth={1.5} size={20} />
                    </button>
                    <div className={mystyle.profileArea}>
                        <div className={mystyle.profileHeader}>
                            <AvatarWrapper asChild avatarURL={avatarURL} className={mystyle.avatarWrapper}>
                                <button disabled={uploadAvatarMutation.isPending || isRemovingAvatar} onClick={() => openDialog(avatarDialogRef)} aria-label='change profile picture' >
                                    {avatarURL ?
                                        <img src={avatarURL} alt="user-avatar" />
                                        : firstLetter}
                                    {
                                        (uploadAvatarMutation.isPending || isRemovingAvatar) &&
                                        <div className={mystyle.spinnerWrapper}>
                                            <Spinner className={clsx(mystyle.spinner)} />
                                        </div>
                                    }
                                </button>
                            </AvatarWrapper>
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
                            <LogOutButton >Log out</LogOutButton>
                            <button disabled={uploadAvatarMutation.isPending || isRemovingAvatar} onClick={() => openDialog(avatarDialogRef)} aria-label='change profile picture'>
                                <Camera size={20} /> {avatarURL ? 'Change' : 'Add'} Photo
                            </button>
                        </div>
                        <dialog ref={avatarDialogRef} className={mystyle.avatarDialog}>
                            <div>
                                <h2 className={mystyle.avatarDialogHeading}>Change Profile Photo</h2>
                                <div className={mystyle.changeAvatarOptions}>
                                    <input ref={inputRef} onChange={uploadAvatar} id='avatarInput' accept='image/*' type="file" style={{ display: 'none' }} />
                                    <label role='button' style={{ color: 'var(--primary-darker)' }} htmlFor='avatarInput'>Upload Photo</label>
                                    <button onClick={() => {
                                        if (!user.avatar.publicId) return toast.error("Nothing to remove", {
                                            description: "You do not have an avatar"
                                        })
                                        closeDialog(avatarDialogRef)
                                        removeAvatar()
                                    }} style={{ color: 'hsl(0, 88%, 57%)' }}>Remove Current Photo</button>
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