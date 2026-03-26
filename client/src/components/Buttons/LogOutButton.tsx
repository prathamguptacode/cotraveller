import { api } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { toast } from 'sonner'


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

    return user && <button style={style} className={className} aria-label='Logout' onClick={() => logout()}>
        <LogOut size={iconSize} /> {children}
    </button>

}

export default LogOutButton
