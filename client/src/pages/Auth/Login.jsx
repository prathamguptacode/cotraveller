import React from 'react'
import styles from './auth.module.css'
import TextField from '../../components/TextField/TextField'
import { Link } from 'react-router-dom'


const Login = () => {
  return (
    <>
      <form className={styles.form} onClick={(e) => e.preventDefault()}>
        <TextField type={'email'} placeholder={'Email Address'} />
        <TextField type={'password'} placeholder={'Password'} />
        <button className={styles.button}>Log in</button>
      </form>
      <div className={styles.switchPage}>
        <Link to={'/signup'} className={styles.anchors} >Sign up</Link>
        <Link to={'/login'} className={styles.anchors} >Forgot Password?</Link>
      </div>
    </>
  )
}

export default Login
