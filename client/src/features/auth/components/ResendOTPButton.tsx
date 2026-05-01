import { useMutation } from '@tanstack/react-query'
import styles from '../auth.module.css'
import { api } from '@/api/axios'
import { toast } from 'sonner'
import { normalizeError } from '@/utils/normalizeError'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'



const ResendOTPButton = () => {
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: () => api.post('/auth/signup/resend'),
        onSuccess: () => toast.success("Successful", {
            description: "A new OTP has been sent"
        }),
        onError: (error) => {
            const { status } = normalizeError(error)
            if (status === 410) {
                toast.error("Session Expired", {
                    description: "Please re-signup, redirecting..."
                })
                navigate('/signup', { replace: true })
            }
            if (status === 429) {
                toast.error("Too many attempts", {
                    description: "Max attempts reached, retry after 10 mins, redirecting..."
                })
                navigate('/', { replace: true })
            }
        }
    })

    const handleResend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        mutation.mutate()
    }
    return (
        <div className={styles.switchPage}>
            <button disabled={mutation.isPending || mutation.isError} aria-label='Resend OTP' role='button' onClick={handleResend} className={clsx(styles.anchors, mutation.isPending && 'disabled')}>Resend OTP</button>
        </div>
    )
}

export default ResendOTPButton
