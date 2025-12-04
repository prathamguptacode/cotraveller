import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import { Link, useNavigate } from 'react-router-dom'
import TextField from '../../components/TextField/TextField'
import { callAuthApi } from '../../api/axios'
import { Eye, EyeClosed } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [fullNameError, setFullNameError] = useState('')

  const [isMounted, setIsMounted] = useState(false)

  const { updateAccessToken, updateUser } = useAuth()
  const navigate = useNavigate()

  const requirements = {
    password: ["8 characters", "1 special character e.g., @, $, etc", "1 number"],
    username: ["3-25 characters"],
    fullName: ["3-35 characters", "No numbers"],
  }

  useEffect(() => {
    if (!isMounted) return setIsMounted(true)
    const timeout = setTimeout(() => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!email) return setEmailError('An email address is required')
      if (!regex.test(email)) return setEmailError("Must be an email");

      (async () => {
        const { status, data } = await callAuthApi('post', '/validateField/email', { email })
        console.log(status)
        if (status >= 400) return setEmailError(data.message)
        if (status == 200) return setEmailError('')
      }
      )()

    }, 1000);

    return () => {
      clearTimeout(timeout)
    }
  }, [email])



  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    const timeout = setTimeout(() => {

      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/
      if (!password) return setPasswordError('A password is required')
      if (!regex.test(password)) return setPasswordError('Enter a stronger password')

      setPasswordError('')

    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [password])



  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    const timeout = setTimeout(() => {

      const regex = /^[a-zA-Z0-9._-]{3,25}$/

      if (!username) return setUsernameError('A username is required')
      if (!regex.test(username)) return setUsernameError("Come on now, enter a valid username");

      (async () => {
        const { status, data } = await callAuthApi('post', '/validateField/username', { username })
        console.log(status)
        if (status >= 400) return setUsernameError(data.message + " :(")
        if (status == 200) return setUsernameError('')

      }
      )()

    }, 1000);

    return () => {
      clearTimeout(timeout)
    }
  }, [username])



  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    const timeout = setTimeout(() => {

      const regex = /^[a-zA-Z\u00C0-\u017F' -]{3,35}$/
      if (!fullName) return setFullNameError('Required')
      if (!regex.test(fullName)) return setFullNameError('Must be a name')

      setFullNameError('')

    }, 1000);

    return () => {
      clearTimeout(timeout)
    }
  }, [fullName])

  const handleSignup = async () => {
    if (emailError || passwordError || usernameError || fullNameError || !email || !password || !username || !fullName) return //### Toast error


    const { status, data } = await callAuthApi('post', '/auth/signup', { email, password, username, fullName })

    if (status == 200) return navigate('/signup/verify')

    const { code, message } = data
    if (code.includes("EMAIL")) setEmailError(message)
    else if (code.includes("USERNAME")) setUsernameError(message)
    else console.error("Something went wrong") //### Toast Error

  }



  return (
    <>
      <form className={styles.form} onClick={(e) => e.preventDefault()}>
        <TextField autoComplete={'email'} setValue={setEmail} value={email} error={emailError} type={'email'} placeholder={'Email Address'} />
        <TextField autoComplete={'new-password'} setValue={setPassword} value={password} error={passwordError} type={'password'} placeholder={'Password'} requirements={requirements.password} />
        <TextField autoComplete={'username'} setValue={setUsername} value={username} error={usernameError} type={'text'} placeholder={'Username'} requirements={requirements.username} />
        <TextField autoComplete={'name'} setValue={setFullName} value={fullName} error={fullNameError} type={'text'} placeholder={'Full Name'} requirements={requirements.fullName} />
        <button onClick={handleSignup} className={styles.button}>Sign up</button>
      </form>
      <div className={styles.switchPage}>
        <Link to={'/login'} className={styles.anchors} >Log in</Link>
      </div>
    </>
  )
}

export default Signup
