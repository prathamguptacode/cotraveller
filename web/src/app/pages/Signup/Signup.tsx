import styles from './styles.module.css'
import { IslandIcon } from '@phosphor-icons/react'
import SignupForm from '@/features/auth/components/Signup/SignupForm'

const Login = () => {
    return (
        <div className={styles.wrapper}>
            <main className={styles.hero}>
                <div className={styles.header}>
                    <span className={styles.logo}>
                        <IslandIcon size={48} />
                    </span>
                    <h1 className={styles.heading}>Sign up for Cotraveller</h1>
                </div>
                <div className={styles.formWrapper}>
                    <div className={styles.formInnerWrapper}>
                        <SignupForm />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login
