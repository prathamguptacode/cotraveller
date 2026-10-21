import { Link, Outlet } from 'react-router-dom'
import styles from './auth.module.css'
import GoogleButton from '@/features/auth/components/OAuthButtons/GoogleButton'
import GithubButton from '@/features/auth/components/OAuthButtons/GithubButton'
import { IslandIcon } from '@phosphor-icons/react'

const AuthLayout = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <main className={styles.hero}>
                    <div className={styles.header}>
                        <span className={styles.logo}>
                            <IslandIcon size={48} />
                        </span>
                        <h1 className={styles.heading}>Sign in to Cotraveller</h1>
                    </div>
                    <div className={styles.formWrapper}>
                        <div className={styles.formInnerWrapper}>
                            <Outlet />
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
                        </div>

                    </div>
                </main>
            </div>
        </>

    )
}

export default AuthLayout
