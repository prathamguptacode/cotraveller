import { useEffect, useState } from 'react'
import styles from './auth.module.css'
import TextField from '@/components/TextField/TextField'
import { Link, useNavigate } from 'react-router-dom'
import { callAuthApi } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import type { AuthContextUser } from '@/types/auth.types'
const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isMounted, setIsMounted] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()
  const { updateUser, updateAccessToken } = useAuth()


  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    const timeout = setTimeout(() => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!email) return setEmailError('An email address is required')
      if (!regex.test(email)) return setEmailError("Must be an email");

      setEmailError('')

    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [email])



  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    const timeout = setTimeout(() => {
      if (!password) return setPasswordError('A password is required')

      setPasswordError('')

    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [password])


  const handleLogin = async () => {
    if (emailError || passwordError || !email || !password) return //### Toast error


    const { status, data } = await callAuthApi<{ user: AuthContextUser, accessToken: string }>('post', '/auth/login', { email, password })

    if (!data.success) {
      if (status == 400) {
        if (data.code == "USER_NOT_FOUND") return setEmailError(data.message)
        return setPasswordError(data.message)
      }
      return console.error("Something went wrong") //### Toast Error
    }

    const { user, accessToken } = data.data
    updateAccessToken(accessToken)
    updateUser(user)

    navigate('/', { replace: true })

  }


  return (
    <>
      <form className={styles.form} onClick={(e) => e.preventDefault()}>
        <TextField autoComplete={'email'} value={email} setValue={setEmail} error={emailError} type={'email'} placeholder={'Email Address'} />
        <TextField autoComplete={'current-password'} value={password} setValue={setPassword} error={passwordError} type={'password'} placeholder={'Password'} />
        <button aria-label='Log in' onClick={handleLogin} className={styles.button}>Log in</button>
      </form>
      <div className={styles.switchPage}>
        <Link to={'/signup'} className={styles.anchors} >Sign up</Link>
        <Link to={'/login'} className={styles.anchors} >Forgot Password?</Link>
      </div>
    </>
  )
}

export default Login
