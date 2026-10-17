import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'

type DirectMessageChatHeaderProps = {
    user: {
        email: string
    }
}

const DirectMessageChatHeader = ({ user }: DirectMessageChatHeaderProps) => {

    return (
        <div className={styles.chatHeader}>
            <div className={styles.imageWrapper}>
                <img src={leon} alt="display-picture" />
            </div>
            <h2 className={styles.headerName}>
                {user.email}
            </h2>
        </div>
    )
}

export default DirectMessageChatHeader
