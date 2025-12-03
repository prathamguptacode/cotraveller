import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './auth.module.css'
import Footer from '../../components/Footer/Footer'
import GoogleButton from '../../components/OAuthButtons/GoogleButton'
import GithubButton from '../../components/OAuthButtons/GithubButton'
import ThemeButton from '../../components/Buttons/ThemeButton'
import AppleButton from '../../components/OAuthButtons/AppleButton'
const AuthLayout = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.hero}>
                    <div className={styles.heroLeft}></div>


                    <div className={styles.heroRight}>
                        <div className={styles.formWrapper}>


                            <div className={styles.formInnerWrapper}>
                                <div className={styles.oAuthButtons}>
                                    <GoogleButton />
                                    <AppleButton />
                                    <GithubButton />
                                </div>
                                <div className={styles.lineBreakers}>
                                    <div className={styles.lineBreaker}></div>
                                    OR
                                    <div className={styles.lineBreaker}></div>
                                </div>
                                <Outlet />
                            </div>

                            <div className={styles.themeBtnWrapper}>
                                <ThemeButton />
                            </div>
                        </div>
                    </div>


                </div>
                <Footer />
            </div>
        </>

    )
}

export default AuthLayout
