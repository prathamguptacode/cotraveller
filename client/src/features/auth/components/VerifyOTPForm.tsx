import styles from '../auth.module.css'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './FormInput'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/axios'
import type { AuthResponse } from '../types'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { normalizeError } from '@/utils/normalizeError'
import { toast } from 'sonner'
import ResendOTPButton from './ResendOTPButton'
import clsx from 'clsx'
import SubmitButton from './SubmitButton'

const VerifyFormSchema = z.object({
    otp: z.coerce.number({ error: "Invalid Format" }).int({ error: "Invalid Format" }).positive({ error: "Invalid Format" }).refine(e => e.toString().length === 6, { error: "Invalid length" })
})

type VerifyFormFields = z.input<typeof VerifyFormSchema>

const requirements = {
    otp: [
        "Exactly 6 digits",
        "Eg: 123456",
    ],
}

const VerifyOTPForm = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const mutation = useMutation({
        mutationFn: (body: VerifyFormFields) => api.post<AuthResponse>('/auth/signup/verify', body),
        onSuccess: (res) => {
            const { updateAccessToken, updateUser } = useAuth()
            updateAccessToken(res.data.accessToken)
            updateUser(res.data.user)
            navigate('/', { replace: true })
        },
        onError: (error: unknown) => {
            const { status, message } = normalizeError(error)
            if (status === 400) return setError('otp', { message })
            if (status === 410) return toast.error("Session Expired", {
                description: "Please Re-Signup, Redirecting...",
                onAutoClose() {
                    navigate('/signup', { replace: true })
                },
            })
            if (status === 409) return toast.error("User Exists", {
                description: "Email/Username is taken, redirecting to signup page...",
                onAutoClose() {
                    navigate('/signup', { replace: true })
                }
            })
            if (status === 429) return toast.error("Attempt limit reached", {
                description: "You have excceded the no. of retries, please request a new OTP",
            })
        }
    })

    const onSubmit: SubmitHandler<VerifyFormFields> = async (body) => {
        mutation.mutate(body)
    }

    const { handleSubmit, setError, register, formState: { errors } } = useForm<VerifyFormFields>({ resolver: zodResolver(VerifyFormSchema) })


    return location.state.isAllowed ?
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} >
                <FormInput<VerifyFormFields> name='otp' error={errors.otp?.message} register={register} autoComplete='one-time-code' placeholder='OTP' type='number' requirements={requirements.otp} />
                <SubmitButton isPending={mutation.isPending}>
                    Continue
                </SubmitButton>
            </form>
            <ResendOTPButton />
        </>
        :
        <Navigate to={'/'} />

}

export default VerifyOTPForm
