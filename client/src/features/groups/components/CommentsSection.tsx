import { useAuth } from '@/hooks/useAuth'
import styles from '../commentsSection.module.css'
import { getImgURL } from '@/lib/cloudinary'
import { useState } from 'react'
import clsx from 'clsx'
import { EllipsisVertical, Heart } from 'lucide-react'
import type { Comment } from '../types'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import { normalizeError } from '@/utils/normalizeError'
import { toast } from 'sonner'
import { useReadMore } from '../hooks/useReadMore'
import moment from 'moment-timezone'





const CommentsSection = () => {
    const { user } = useAuth()
    const { groupId } = useParams() as { groupId: string }

    const url = user && getImgURL(user.avatar.publicId, user.avatar.version, 400)

    const { data: comments, refetch: refetchComments } = useSuspenseQuery({
        queryKey: ['groups', groupId, 'comments'],
        queryFn: () => api.get<{ comments: Comment[] }>(`/groups/${groupId}/comments`),
        select: (res) => res.data.comments
    })

    const [comment, setComment] = useState<{ text: string, isFocused: boolean }>({ text: '', isFocused: false })

    const clearInput = () => {
        setComment({ text: '', isFocused: false })
    }


    const { mutate: postComment, isPending } = useMutation({
        mutationFn: () => api.post(`/groups/${groupId}/comments`, { comment: comment.text }),
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status < 500) toast.error(err.message)
        },
        // Manual Cache update does not fit our use case, refetch works for now
        onSettled: () => refetchComments(),
        onSuccess: () => clearInput()
    })





    return (
        <section className={styles.wrapper}>
            <header>
                <h2 className={styles.heading}>{comments.length} Comments</h2>
            </header>
            <div className={styles.commentInputArea}>
                <div className={styles.avatarWrapper}>
                    {url ? <img src={url} alt="user-avatar" /> : user?.fullName.charAt(0)}
                </div>
                <div className={styles.commentInputWrapper}>
                    <textarea onFocus={() => setComment(prev => ({ ...prev, isFocused: true }))} onChange={(e) => setComment(prev => ({ ...prev, text: e.target.value }))} value={comment.text} placeholder='Add a comment..' className={styles.commentInput} rows={1} />
                    <div className={clsx(styles.commentButtons, comment.isFocused && styles.buttonsVisible)}>
                        <button onClick={clearInput} className={styles.cancelButton}>Cancel</button>
                        <button disabled={!comment.text || isPending} className={styles.commentButton} onClick={() => postComment()}>Comment</button>
                    </div>
                </div>
            </div>
            <div className={styles.comments}>
                {comments.map(comment => {
                    return (
                        <Comment key={comment._id} comment={comment} />
                    )
                })}
            </div>
        </section>
    )
}

export default CommentsSection


type CommentProps = {
    comment: Comment
}

const Comment = ({ comment }: CommentProps) => {
    const { user } = useAuth()
    const url = comment.author.avatar.publicId && getImgURL(comment.author.avatar.publicId, comment.author.avatar.version, 400)

    const { paragraphRef, readMoreRef } = useReadMore()


    return (
        <div className={styles.comment}>
            <div className={styles.avatarWrapper}>
                {url ? <img src={url} alt="comment-author-avatar" /> : comment.author?.fullName.charAt(0)}
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.contentHeader}>
                    <span className={styles.username}>{comment?.author.username}</span>
                    <span>{moment.duration(new Date().getTime() - new Date(comment.createdAt).getTime()).humanize()} ago</span>
                    {comment.author._id === user?._id && < button className={styles.commentOptions}><EllipsisVertical size={20} /></button>}
                </div>
                <p ref={paragraphRef} className={styles.content}>
                    {comment.comment}
                </p>
                <input type="checkbox" id={`toggleMoreContent-for-${comment._id}`} style={{ display: 'none' }} />
                <label ref={readMoreRef} role='button' htmlFor={`toggleMoreContent-for-${comment._id}`} className={styles.toggleMoreContent} />
                <div className={styles.interactionsWrapper}>
                    <button className={styles.likeButton} aria-label='like'>
                        <Heart size={16} />
                    </button>
                    <span>50</span>
                </div>
            </div>
        </div >
    )
}
