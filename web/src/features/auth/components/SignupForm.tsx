import { AuthFormSchema } from '../schema'
import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './FormInput'
import styles from '../auth.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { normalizeError } from '@/utils/normalizeError'
import SubmitButton from './SubmitButton'



const SignupFormSchema = z.object({
    ...AuthFormSchema.shape,
    fullName: z.string()
        .trim()
        .max(32, { message: "Name too long" })
        .optional()
        .describe("Optional , but if there must be atleast 1 character long"),
    username: z
        .string({ message: "Username too short" })
        .trim()
        .min(4, { message: "Username too short" })
        .max(16, { message: "Username too long" })
        .regex(/^[a-zA-Z0-9]+(-?[a-zA-Z0-9])*$/, { message: "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen." })
        .toLowerCase()
})
const requirements = {
    password: [
        "8 - 64 characters",
        "1 special char (@, $, !...)",
        "1 number",
        "1 uppercase letter",
        "1 lowercase letter"
    ],
    username: [
        "4 -16 characters",
        "Alphanumberic with single hyphens"
    ],
    fullName: [
        "Optional",
        "Max 32 characters",
        "No numbers or symbols"
    ],
}
type SignupFormFields = z.infer<typeof SignupFormSchema>



const SignupForm = () => {
    const navigate = useNavigate()
    const { handleSubmit, register, setError, formState: { errors, isValid } } = useForm<SignupFormFields>({ resolver: zodResolver(SignupFormSchema) })




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
                <SubmitButton isValid={isValid} isPending={mutation.isPending}>Sign up</SubmitButton>
            </form>
            <div className={styles.switchPage}>
                <Link to={'/login'} className={styles.anchors}>Log in</Link>
            </div>
        </>
    )
}

export default SignupForm
