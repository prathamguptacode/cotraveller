import React from 'react'
import styles from './extras.module.css'

const LoadingPage = () => {
    return (
        <h1 className={styles.loadingPage}>
            <div className={styles.loader} />
        </h1>
    )
}

export default LoadingPage
