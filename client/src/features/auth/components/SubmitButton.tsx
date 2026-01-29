import clsx from 'clsx'
import styles from '../auth.module.css'
import Spinner from '@/components/Loaders/Spinner'

type SubmitButtonProps = {
    isPending: boolean,
    children: string
}

const SubmitButton = ({ isPending, children }: SubmitButtonProps) => {
    return (
        <button disabled={isPending} aria-label={children} className={clsx(styles.button, isPending && 'disabledBtn')}>
            {isPending ? <Spinner /> : children}
        </button>
    )
}

export default SubmitButton
