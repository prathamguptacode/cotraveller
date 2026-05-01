import styles from './extras.module.css'

const LoadingPage = ({ bgColor = '' }) => {
    return (
        <div style={{ backgroundColor: bgColor }} className={styles.loadingPage}>
            <div className={styles.loader} />
        </div>
    )
}

export default LoadingPage
