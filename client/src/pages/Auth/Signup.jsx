import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import { Link } from 'react-router-dom'
import TextField from '../../components/TextField/TextField'
import { api, callAuthApi } from '../../api/axios'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [fullNameError, setFullNameError] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!email) return setEmailError('An email address is required')
      if (!regex.test(email)) return setEmailError("Must be an email")
      
      // const response = await callAuthApi('')
    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [email])



  useEffect(() => {
    const timeout = setTimeout(() => {

    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [password])



  useEffect(() => {
    const timeout = setTimeout(() => {

    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [username])



  useEffect(() => {
    const timeout = setTimeout(() => {

    }, 500);

    return () => {
      clearTimeout(timeout)
    }
  }, [fullName])




  return (
    <>
      <form className={styles.form} onClick={(e) => e.preventDefault()}>
        <TextField setValue={setEmail} value={email} error={setEmailError} type={'email'} placeholder={'Email Address'} />
        <TextField setValue={setPassword} value={password} error={setPasswordError} type={'password'} placeholder={'Password'} />
        <TextField setValue={setUsername} value={username} error={setUsernameError} type={'text'} placeholder={'Username'} />
        <TextField setValue={setFullName} value={fullName} error={setFullNameError} type={'text'} placeholder={'Full Name'} />
        <button className={styles.button}>Sign up</button>
      </form>
      <div className={styles.switchPage}>
        <Link to={'/login'} className={styles.anchors} >Log in</Link>
      </div>
    </>
  )
}

export default Signup
