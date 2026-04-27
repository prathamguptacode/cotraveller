import { api } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import { DoorOpen } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { toast } from 'sonner'
import AlertDialog from '../Dialogs/AlertDialog'


type LogOutButtonProps = {
    className?: string,
    children?: ReactNode,
    iconSize?: number,
    style?: CSSProperties
}


const LogOutButton = ({ className, children, iconSize, style }: LogOutButtonProps) => {
    const { user } = useAuth()

    const { mutate: logout } = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => window.location.reload(),
        onError: () => toast.error("An error occurred", {
            description: "Please try again later"
        })
    })

    return user &&
        <AlertDialog>
            <AlertDialog.Trigger>
                <button style={style} className={className} aria-label='Logout'>
                    <DoorOpen size={iconSize} /> {children}
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <AlertDialog.Title>
                        Are you absolutely sure?
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                        You will be logged out if you proceed.
                    </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.CancelButton>
                        Cancel
                    </AlertDialog.CancelButton>
                    <AlertDialog.ConfirmButton confirmActionHandler={logout}>
                        Log out
                    </AlertDialog.ConfirmButton>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>

}

export default LogOutButton
