import styles from '@/features/chats/chats.module.css'
import Sidebar from '@/features/chats/components/Sidebar'
import ChatArea from '@/features/chats/components/ChatArea'


const Chats = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <Sidebar />
                <ChatArea />
            </div >
        </>

    )
}

export default Chats

