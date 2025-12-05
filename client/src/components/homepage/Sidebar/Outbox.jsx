import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const Outbox = () => {

    return (
        <div className={styles.list}>
            <Link className={styles.listItem}>
                <div className={styles.avatarWrapper} >
                    <img src="apple-light.svg" alt="avatar" />
                </div>
                <div className={styles.detailsWrapper}>
                    <p className={styles.groupName}>The HitchHikers</p>
                    <p className={styles.lastMessage}>Member: 4/5</p>
                </div>
                <div className={styles.choicesWrapper}>
                    <button> <X color='#EE2D3E' /></button>
                </div>
            </Link>

        </div>
    )
}

export default Outbox
