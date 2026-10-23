import LoginForm from '@/features/auth/components/LoginForm'
import styles from './styles.module.css'
import { IslandIcon } from '@phosphor-icons/react'

const Login = () => {
    return (
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
                        <LoginForm />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login
