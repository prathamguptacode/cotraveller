import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'

const DirectMessageChatHeader = () => {

    return (
        <div className={styles.chatHeader}>
            <div className={styles.imageWrapper}>
                <img src={leon} alt="display-picture" />
            </div>
            <h2 className={styles.headerName}>
                Shubham Panjiyara
            </h2>
        </div>
    )
}

export default DirectMessageChatHeader
