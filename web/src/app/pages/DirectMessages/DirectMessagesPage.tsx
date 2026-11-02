import { ChatsCircleIcon } from '@phosphor-icons/react'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'


const DirectMessagesPage = () => {
  return (
    <div data-mobile-visible={false} className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        <ChatsCircleIcon size={128} weight='thin' />
        <div className={styles.content}>
          <h2 title='Connect with other travellers' className={styles.title}>Connect with other travellers</h2>
          <p className={styles.description}>
            Send messages, create your own or join other trips
          </p>
          <Link to={'/search'} className={styles.redirectButton}>
            Discover Trips
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DirectMessagesPage
