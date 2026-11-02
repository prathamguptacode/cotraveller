import styles from './oAuthButtons.module.css'

const AppleButton = () => {

    return (
        <button aria-label='Continue with apple' className={styles.wrapper} >
            <img src="/apple-light.svg" alt="apple-light-icon" />
        </button>
    )
}

export default AppleButton
