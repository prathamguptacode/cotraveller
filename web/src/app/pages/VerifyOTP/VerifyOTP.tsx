import { Navigate, useLocation } from 'react-router-dom'
import styles from './styles.module.css'
import VerifyOTPForm from '@/features/auth/components/VerifyOTPForm'


const VerifyOTP = () => {
    const location = useLocation()

    return location.state?.isAllowed ?
        (
            <div className={styles.wrapper}>
                <main className={styles.hero}>
                    <div className={styles.header}>
                        <h1 className={styles.heading}>Confirm your email address</h1>
                        <p>We have sent a code to {location.state?.email}</p>
                        <h2 className={styles.subHeading}>Enter code</h2>
                    </div>
                    <div className={styles.formWrapper}>
                        <div className={styles.formInnerWrapper}>
                            <VerifyOTPForm />
                        </div>
                    </div>
                </main>
            </div>
        ) :
        <Navigate to={'/login'} />
}

export default VerifyOTP
