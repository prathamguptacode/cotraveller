import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './auth.module.css'
import Footer from '../../components/Footer/Footer'
import GoogleButton from '../../components/OAuthButtons/GoogleButton'
import GithubButton from '../../components/OAuthButtons/GithubButton'
const AuthLayout = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.hero}>
                    <div className={styles.heroLeft}></div>


                    <div className={styles.heroRight}>
                        <div className={styles.formWrapper}>
                            <GoogleButton />
                            <GithubButton />
                        </div>
                    </div>


                </div>
                <Footer />
            </div>
        </>

    )
}

export default AuthLayout
