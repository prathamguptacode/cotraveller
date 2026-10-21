import { IslandIcon } from '@phosphor-icons/react'
import styles from './styles.module.css'
import type { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}


const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={styles.wrapper}>
            <main className={styles.hero}>
                <div className={styles.header}>
                    <span className={styles.logo}>
                        <IslandIcon size={48} />
                    </span>
                    <h1 className={styles.heading}>Sign in to Cotraveller</h1>
                </div>
                <div className={styles.formWrapper}>
                    <div className={styles.formInnerWrapper}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Layout
