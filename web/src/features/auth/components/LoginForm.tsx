import styles from '../auth.module.css'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { AuthFormSchema } from '../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './FormInput'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { AuthResponse } from '../types'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { normalizeError } from '@/utils/normalizeError'
import SubmitButton from './Signup/SubmitButton'
import GoogleButton from './OAuthButtons/GoogleButton'
import GithubButton from './OAuthButtons/GithubButton'

const LoginFormSchema = AuthFormSchema

type LoginFormFields = z.infer<typeof LoginFormSchema>

const requirements = {
    password: [
        "8 - 64 characters",
        "1 special char (@, $, !...)",
        "1 number",
        "1 uppercase letter",
        "1 lowercase letter"
    ],
}

const LoginForm = () => {
    const navigate = useNavigate()
    const { updateAccessToken, updateUser } = useAuth()

    const mutation = useMutation({
        mutationFn: (body: LoginFormFields) => api.post<AuthResponse>('/auth/login', body),
        onSuccess: (res) => {
            updateAccessToken(res.data.accessToken)
            updateUser(res.data.user)

            navigate('/', { replace: true })
        },
        onError: (error: unknown) => {
            const { code, message } = normalizeError(error)
            if (code === 'USER_NOT_FOUND') return setError('email', { message })
            if (code.includes('PASSWORD')) return setError('password', { message })
        }
    })

    const onSubmit: SubmitHandler<LoginFormFields> = async (body) => {
        mutation.mutate(body)
    }

    const { handleSubmit, setError, register, formState: { errors, isValid } } = useForm<LoginFormFields>({ resolver: zodResolver(LoginFormSchema) })

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} >
                <FormInput<LoginFormFields> name='email' error={errors.email?.message} register={register} autoComplete='email' placeholder='Email address' type='email' />
                <FormInput<LoginFormFields> name='password' error={errors.password?.message} register={register} autoComplete='current-password' placeholder='Password' type='password' requirements={requirements.password} />
                <SubmitButton isValid={isValid} isPending={mutation.isPending}>Sign in</SubmitButton>
            </form>
            <div className={styles.lineBreakers}>
                <div className={styles.lineBreaker}></div>
                or
                <div className={styles.lineBreaker}></div>
            </div>
            <div className={styles.oAuthButtons}>
                <GoogleButton />
                <GithubButton />
            </div>
            <div className={styles.switchPage}>
                <div className={styles.anchorWrapper}>
                    <span>New to Cotraveller?</span>
                    <Link to={'/signup'} className={styles.anchors}>Create an account</Link>
                </div>
                <Link to={'/login'} className={styles.anchors} >Forgot Password?</Link>
            </div>
        </>
    )
}

export default LoginForm
