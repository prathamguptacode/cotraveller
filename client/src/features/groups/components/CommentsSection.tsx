import { useAuth } from '@/hooks/useAuth'
import styles from '../commentsSection.module.css'
import { getImgURL } from '@/lib/cloudinary'
import { useState } from 'react'
import clsx from 'clsx'
import { EllipsisVertical, Heart } from 'lucide-react'


const CommentsSection = () => {
    const { user } = useAuth()
    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 400)

    const [comment, setComment] = useState<{ text: string, isFocused: boolean }>({ text: '', isFocused: false })

    const clearInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setComment({ text: '', isFocused: false })
        e.currentTarget.blur()
    }

    return (
        <section className={styles.wrapper}>
            <header>
                <h2 className={styles.heading}>0 Comments</h2>
            </header>
            <div className={styles.commentInputArea}>
                <div className={styles.avatarWrapper}>
                    {url ? <img src={url} alt="user-avatar" /> : user?.fullName.charAt(0)}
                </div>
                <div className={styles.commentInputWrapper}>
                    <textarea onFocus={() => setComment(prev => ({ ...prev, isFocused: true }))} onChange={(e) => setComment(prev => ({ ...prev, text: e.target.value }))} value={comment.text} placeholder='Add a comment..' className={styles.commentInput} rows={1} />
                    <div className={clsx(styles.commentButtons, comment.isFocused && styles.buttonsVisible)}>
                        <button onClick={clearInput} className={styles.cancelButton}>Cancel</button>
                        <button disabled={!comment} className={styles.commentButton}>Comment</button>
                    </div>
                </div>
            </div>
            <div className={styles.comments}>
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
            </div>
        </section>
    )
}

export default CommentsSection


const Comment = () => {
    const { user } = useAuth()
    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 400)
    return (
        <div className={styles.comment}>
            <div className={styles.avatarWrapper}>
                {url ? <img src={url} alt="user-avatar" /> : user?.fullName.charAt(0)}
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.contentHeader}>
                    <span className={styles.username}>{user?.username}</span>
                    <span>3 hours ago</span>
                    <button className={styles.commentOptions}><EllipsisVertical size={20} /></button>
                </div>
                <p className={styles.content}>
                    honestly i'd love it if guardian slayer was a better bridge between sven and eman slayers because t3 sven is the first "challenge" to progression for slayers and then once you get past t3/t4 sven you're hit with a very easy t1 eman and then immediately afterwards you have the wall known as t2 eman and that's where you start realising you're needing to get into the midgame to continue, but if guardian is between sven and eman, you'll be better introduced to fishing as a skill than enid can teach you, and you're given something harder than sven but easier than eman slayer so you can gradually improve rather than hit the brick wall full speed
                </p>
                <input type="checkbox" id="toggleMoreContent" style={{ display: 'none' }} />
                <label role='button' htmlFor='toggleMoreContent' className={styles.toggleMoreContent} />
                <div className={styles.interactionsWrapper}>
                    <button className={styles.likeButton} aria-label='like'>
                        <Heart size={16} />
                    </button>
                    <span>50</span>
                </div>
            </div>
        </div>
    )
}
