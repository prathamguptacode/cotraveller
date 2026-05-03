import { useTheme } from '@/hooks/useTheme'
import styles from './oAuthButtons.module.css'

const AppleButton = () => {
    const {theme}= useTheme()
    return (
        <button aria-label='Continue with apple' className={styles.wrapper} >
            {theme == 'dark' ?
                <img  src="/apple-light.svg" alt="apple-light-icon" />
                :
                <img src="/apple-dark.svg" alt="apple-dark-icon" />
            }
        </button>
    )
}

export default AppleButton
