import React from 'react'
import styles from './oAuthButtons.module.css'
import { useTheme } from '../../hooks/useTheme'

const GithubButton = () => {
  const { theme } = useTheme()

  return (
    <a className={styles.wrapper} href="/api/oauth/github">
      {theme == 'dark' ?
        <img className={styles.gitSvg} src="/github-mark-white.svg" alt="github-mark-white" />
        :
        <img className={styles.gitSvg} src="/github-mark.svg" alt="github-mark" />
      }
    </a>
  )
}

export default GithubButton
