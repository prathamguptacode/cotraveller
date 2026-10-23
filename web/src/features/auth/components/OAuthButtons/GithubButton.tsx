import styles from './oAuthButtons.module.css'

const prefix = import.meta.env.VITE_API_BASE_URL ?? ''

const GithubButton = () => {

  return (
    <button aria-label='Continue with github' className={styles.wrapper} onClick={() => window.location.href = `${prefix}/api/oauth/github`} >
      <img className={styles.gitSvg} src="/github-mark-white.svg" alt="github-mark-white" />
      <span>Continue with Github</span>
    </button>
  )
}

export default GithubButton
