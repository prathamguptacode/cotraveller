import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'

const Groups = () => {

  return (
    <div className={styles.list}>
      <Link className={styles.listItem}>
        <div className={styles.avatarWrapper} >
          <img src="apple-light.svg" alt="avatar" />
        </div>
        <div className={styles.detailsWrapper}>
          <p className={styles.groupName}>The HitchHikers</p>
          <p className={styles.lastMessage}>You: Great!</p>
        </div>
      </Link>
    </div>

  )
}

export default Groups
