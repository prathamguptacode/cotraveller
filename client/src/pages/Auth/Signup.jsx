import React from 'react'
import styles from './auth.module.css'
import { Link } from 'react-router-dom'
import TextField from '../../components/TextField/TextField'

const Signup = () => {
  return (
    <>
      <form className={styles.form} onClick={(e) => e.preventDefault()}>
        <TextField type={'email'} placeholder={'Email Address'} />
        <TextField type={'password'} placeholder={'Password'} />
        <TextField type={'text'} placeholder={'Username'} />
        <TextField type={'text'} placeholder={'Full Name'} />
        <button className={styles.button}>Sign up</button>
      </form>
      <div className={styles.switchPage}>
        <Link to={'/login'} className={styles.anchors} >Log in</Link>
      </div>
    </>
  )
}

export default Signup
