import styles from '../auth.module.css'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './FormInput'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { AuthResponse } from '../types'
import { Link, useNavigate } from 'react-router-dom'
import { normalizeError } from '@/utils/normalizeError'
import SubmitButton from './SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { ArrowRightIcon } from '@phosphor-icons/react'
import clsx from 'clsx'

const VerifyFormSchema = z.object({
    otp: z.coerce
        .number({ error: "Please check the email that we sent and enter the 8 digit code" })
        .int({ error: "Please check the email that we sent and enter the 8 digit code" })
        .min(1e7, { error: "Please check the email that we sent and enter the 8 digit code" })
        .max(1e8 - 1, { error: "Please check the email that we sent and enter the 8 digit code" })
})

type VerifyFormFields = z.input<typeof VerifyFormSchema>


const VerifyOTPForm = () => {
    const navigate = useNavigate()
    const { updateUser, updateAccessToken } = useAuth()

    const mutation = useMutation({
        mutationFn: (body: VerifyFormFields) => api.post<AuthResponse>('/auth/signup/verify-otp', body),
        onSuccess: (res) => {
            updateAccessToken(res.data.accessToken)
            updateUser(res.data.user)
            navigate('/', { replace: true })
        },
        onError: (error: unknown) => {
            const { status, message } = normalizeError(error)
            if (status < 500) return setError('otp', { message })
        }
    })

    const onSubmit: SubmitHandler<VerifyFormFields> = async (body) => {
        mutation.mutate(body)
    }

    const { handleSubmit, setError, register, formState: { errors } } = useForm<VerifyFormFields>({ resolver: zodResolver(VerifyFormSchema) })

    const resendMutation = useMutation({
        mutationFn: () => api.post('/auth/signup/resend-otp'),
        onError: (err) => {
            const { status, message } = normalizeError(err)
            if (status < 500) return setError('otp', { message })
        }
    })

    const handleResend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        resendMutation.mutate()
    }
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} >
                <FormInput<VerifyFormFields> name='otp' error={errors.otp?.message} register={register} autoComplete='one-time-code' placeholder='Confirmation code' type='number' />
                <SubmitButton isPending={mutation.isPending}>
                    Continue
                </SubmitButton>
            </form>
            <p className={styles.footerText}>
                Didn't get your email? <button disabled={mutation.isPending || mutation.isError} aria-label='Resend OTP' role='button' onClick={handleResend} className={clsx(styles.anchors, mutation.isPending && 'disabled')}>Resend the code</button> or <Link className={styles.anchors} to={'/signup'}>change your email address</Link>
            </p>
            <div className={styles.switchPage}>
                <div className={styles.anchorWrapper}>
                    <span>Already have an account?</span>
                    <Link to={'/login'} className={styles.anchors}>
                        <span>
                            Sign in
                        </span>
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default VerifyOTPForm
