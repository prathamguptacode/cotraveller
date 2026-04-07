import styles from '@/features/chats/chats.module.css'
import ChatArea from '@/features/chats/components/ChatArea'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ThreeDotLoader from '@/components/Loaders/ThreeDotLoader'
import NotFound from './NotFound/NotFound'


const Chats = () => {
    return (
        <>
            <div data-mobile-nav-hidden='true' className={styles.wrapper}>
                {/* <Sidebar /> */}
                <ErrorBoundary fallback={<div className={styles.chatAreaWrapper} style={{ overflow: 'hidden' }}><NotFound /></div>}>
                    <Suspense fallback={<div className={styles.chatAreaWrapper}><ThreeDotLoader /></div>}>
                        <ChatArea />
                    </Suspense>
                </ErrorBoundary>
            </div >
        </>

    )
}

export default Chats

