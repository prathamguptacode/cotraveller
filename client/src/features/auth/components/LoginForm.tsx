import styles from '../auth.module.css'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { AuthFormSchema } from '../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './FormInput'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/axios'
import type { AuthResponse } from '../types'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { normalizeError } from '@/utils/normalizeError'
import SubmitButton from './SubmitButton'

const LoginFormSchema = AuthFormSchema

type LoginFormFields = z.infer<typeof LoginFormSchema>

const requirements = {
    password: [
        "8+ characters",
        "1 special char (@, $, !...)",
        "1 number",
        "1 uppercase letter",
        "1 lowercase letter"
    ],
}

const LoginForm = () => {

    const mutation = useMutation({
        mutationFn: (body: LoginFormFields) => api.post<AuthResponse>('/auth/login', body),
        onSuccess: (res) => {
            const { updateAccessToken, updateUser } = useAuth()
            updateAccessToken(res.data.accessToken)
            updateUser(res.data.user)
            const navigate = useNavigate()
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

    const { handleSubmit, setError, register, formState: { errors } } = useForm<LoginFormFields>({ resolver: zodResolver(LoginFormSchema) })

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} >
                <FormInput<LoginFormFields> name='email' error={errors.email?.message} register={register} autoComplete='email' placeholder='Email address' type='email' />
                <FormInput<LoginFormFields> name='password' error={errors.password?.message} register={register} autoComplete='current-password' placeholder='Password' type='password' requirements={requirements.password} />
                <SubmitButton isPending={mutation.isPending}>Log in</SubmitButton>
            </form>
            <div className={styles.switchPage}>
                <Link to={'/signup'} className={styles.anchors} >Sign up</Link>
                <Link to={'/login'} className={styles.anchors} >Forgot Password?</Link>
            </div>
        </>
    )
}

export default LoginForm
