import styles from '../auth.module.css'

type SubmitButtonProps = {
    isPending: boolean,
    children: string
}

const SubmitButton = ({ isPending, children }: SubmitButtonProps) => {
    return (
        <button disabled={isPending} aria-label={children} className={styles.submitButton}>
            {children}
        </button>
    )
}

export default SubmitButton
