import styles from '../../auth.module.css'

type SubmitButtonProps = {
    isPending: boolean,
    isValid: boolean,
    children: string
}

const SubmitButton = ({ isPending, isValid, children }: SubmitButtonProps) => {
    return (
        <button disabled={isPending && !isValid} aria-label={children} className={styles.submitButton}>
            {children}
        </button>
    )
}

export default SubmitButton
