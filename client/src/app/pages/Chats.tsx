import styles from '@/features/chats/chats.module.css'
import Sidebar from '@/features/chats/components/Sidebar'
import ChatArea from '@/features/chats/components/ChatArea'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import LoadingPage from './Extras/LoadingPage'


const Chats = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <Sidebar />
                <ErrorBoundary fallback={<div>Error ho gaya hai, jaan bhi denge</div>}>
                    <Suspense fallback={<LoadingPage />}>
                        <ChatArea />
                    </Suspense>
                </ErrorBoundary>
            </div >
        </>

    )
}

export default Chats

