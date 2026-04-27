import { useReadMore } from '@/features/groups/hooks/useReadMore'
import styles from './ui.module.css'
import clsx from 'clsx'

type ExpandableTextProps = {
  inputId: string,
  text: string,
  className?: string
}

const ExpandableText = ({ inputId, text, className }: ExpandableTextProps) => {
  const { paragraphRef, readMoreRef } = useReadMore()
  return (
    <>
      <p ref={paragraphRef} className={clsx(styles.content, className)}>
        {text}
      </p>
      <input type="checkbox" id={inputId} style={{ display: 'none' }} />
      <label ref={readMoreRef} role='button' htmlFor={inputId} className={styles.toggleMoreContent} />
    </>
  )
}

export default ExpandableText
