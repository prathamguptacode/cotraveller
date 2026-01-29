import { AuthFormSchema } from '../schema'
import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './FormInput'
import styles from '../auth.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/axios'
import { normalizeError } from '@/utils/normalizeError'
import SubmitButton from './SubmitButton'
import { toast } from 'sonner'
import { useEffect } from 'react'


const normalizeFullName = (v: string) => v.trim().replace(/\s+/g, " ").replace(/['-]{2,}/g, (m) => m[0])
const SignupFormSchema = z.object({
    ...AuthFormSchema.shape,
    fullName: z.string()
        .min(5, "Name too short")
        .max(35, "Name too long")
        .transform(normalizeFullName)
        .refine(
            (v) => /^\p{L}+([ '-]\p{L}+)*$/u.test(v),
            {
                message:
                    "Use letters only, with single spaces, hyphens, or apostrophes between words",
            }),
    username: z
        .string({
            message: "Username is required"
        })
        .trim() // Automatically removes leading/trailing spaces
        .min(3, { message: "Username too short" })
        .max(25, { message: "Username too long" })
        .regex(/^[a-zA-Z0-9._-]+$/, {
            message: "Only letters, numbers, ., -, and _ allowed",
        })
})
const requirements = {
    password: [
        "Minimum :",
        "8+ characters",
        "1 special char (@, $, !...)",
        "1 number",
        "1 uppercase letter",
        "1 lowercase letter"
    ],
    username: [
        "3-25 characters",
        "Letters, numbers, . - _ are allowed"
    ],
    fullName: [
        "3-35 characters",
        "No numbers or symbols"
    ],
}
type SignupFormFields = z.infer<typeof SignupFormSchema>



const SignupForm = () => {
    const navigate = useNavigate()
    const { handleSubmit, register, setError, formState: { errors } } = useForm<SignupFormFields>({ resolver: zodResolver(SignupFormSchema) })




    const mutation = useMutation({
        mutationFn: (body: SignupFormFields) => api.post('/auth/signup', body),
        onSuccess: () => navigate('/signup/verify', { state: { isAllowed: true } }),
        onError: (error: unknown) => {
            const { code, message } = normalizeError(error)
            if (code.includes('EMAIL')) return setError('email', { message })
            if (code.includes('USERNAME')) return setError('username', { message })
        }
    })
    const onSubmit: SubmitHandler<SignupFormFields> = async (body) => {
        mutation.mutate(body)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <FormInput<SignupFormFields> name='email' error={errors.email?.message} register={register} autoComplete='email' placeholder='Email address' type='email' />
                <FormInput<SignupFormFields> name='password' error={errors.password?.message} register={register} autoComplete='new-password' placeholder='Password' type='password' requirements={requirements.password} />
                <FormInput<SignupFormFields> name='username' error={errors.username?.message} register={register} autoComplete='username' placeholder='Username' type='text' requirements={requirements.username} />
                <FormInput<SignupFormFields> name='fullName' error={errors.fullName?.message} register={register} autoComplete='name' placeholder='Full name' type='text' requirements={requirements.fullName} />
                <SubmitButton isPending={mutation.isPending}>Sign up</SubmitButton>
            </form>
            <div className={styles.switchPage}>
                <Link to={'/login'} className={styles.anchors} >Log in</Link>
            </div>
        </>
    )
}

export default SignupForm
