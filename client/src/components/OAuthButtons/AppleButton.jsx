import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import styles from './oAuthButtons.module.css'

const AppleButton = () => {
    const {theme}= useTheme()
    return (
        <button aria-label='Continue with apple' className={styles.wrapper} onClick={() => window.location.href = '/api/oauth/apple'} >
            {theme == 'dark' ?
                <img  src="/apple-light.svg" alt="apple-light-icon" />
                :
                <img src="/apple-dark.svg" alt="apple-dark-icon" />
            }
        </button>
    )
}

export default AppleButton
