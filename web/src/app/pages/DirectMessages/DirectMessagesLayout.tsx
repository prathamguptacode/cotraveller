import DirectMessagesList from "@/features/chat/components/DirectMessages/DirectMessagesList"
import styles from './styles.module.css'
import { Outlet } from "react-router-dom"

const DirectMessagesLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <DirectMessagesList />
      </aside>
      <div className={styles.mainWrapper}>
        <Outlet />
      </div>
    </div>
  )
}

export default DirectMessagesLayout
