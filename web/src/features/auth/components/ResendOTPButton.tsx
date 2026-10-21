import { useMutation } from '@tanstack/react-query'
import styles from '../auth.module.css'
import { api } from '@/lib/axios'
import clsx from 'clsx'



const ResendOTPButton = () => {
    const mutation = useMutation({
        mutationFn: () => api.post('/auth/signup/resend-otp')
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
