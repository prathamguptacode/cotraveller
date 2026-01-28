import { Outlet } from 'react-router-dom'
import styles from './auth.module.css'
import GoogleButton from '@/components/OAuthButtons/GoogleButton'
import GithubButton from '@/components/OAuthButtons/GithubButton'
import AppleButton from '@/components/OAuthButtons/AppleButton'

const AuthLayout = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.hero}>

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

                    </div>



                </div>
            </div>
        </>

    )
}

export default AuthLayout
