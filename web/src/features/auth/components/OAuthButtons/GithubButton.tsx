import styles from './oAuthButtons.module.css'

const GithubButton = () => {

  return (
    <button aria-label='Continue with github' className={styles.wrapper} onClick={() => window.location.href = '/api/oauth/github'} >
      <img className={styles.gitSvg} src="/github-mark-white.svg" alt="github-mark-white" />
      <span>Continue with Github</span>
    </button>
  )
}

export default GithubButton
