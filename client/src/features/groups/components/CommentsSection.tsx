import { useAuth } from '@/hooks/useAuth'
import styles from '../commentsSection.module.css'
import { getImgURL } from '@/lib/cloudinary'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { EllipsisVertical, Heart, Trash2, User2 } from 'lucide-react'
import type { Comment } from '../types'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api/axios'
import { normalizeError } from '@/utils/normalizeError'
import { toast } from 'sonner'
import { useReadMore } from '../hooks/useReadMore'
import moment from 'moment-timezone'
import type { ApiSuccess } from '@/types/api.types'
import { useAnimation, motion } from 'framer-motion'
import Avatar from '@/components/ui/Avatar'




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


    const { mutate: postComment, isPending: isPosting } = useMutation({
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
                <h3 className={styles.heading}>{comments.length} Comments</h3>
            </header>
            <div className={styles.commentInputArea}>

                <div className={clsx(styles.avatarWrapper, (user && !url) && styles.emptyAvatar)}>
                    {user ? url ? <img src={url} alt="user-avatar" /> : user?.fullName.charAt(0) : <User2 />}
                </div>

                <div className={styles.commentInputWrapper}>

                    <textarea onFocus={() => setComment(prev => ({ ...prev, isFocused: true }))} onChange={(e) => setComment(prev => ({ ...prev, text: e.target.value }))} value={comment.text} placeholder='Add a comment..' className={styles.commentInput} rows={1} />

                    <div className={clsx(styles.commentButtons, comment.isFocused && styles.buttonsVisible)}>

                        <button onClick={clearInput} className={styles.cancelButton}>
                            Cancel
                        </button>

                        {user ?
                            <button disabled={!comment.text || isPosting} className={styles.commentButton} onClick={() => postComment()}>
                                Comment
                            </button> :

                            <Link to={'/login'} className={styles.commentButton}>
                                Sign in
                            </Link>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.comments}>
                {comments.map((comment, index) => {
                    return (
                        <Comment index={index} refetchComments={refetchComments} key={comment._id} comment={comment} />
                    )
                })}
            </div>
        </section>
    )
}

export default CommentsSection


type CommentProps = {
    comment: Comment,
    refetchComments: () => void,
    index: number
}

const Comment = ({ comment, refetchComments, index }: CommentProps) => {
    const { user } = useAuth()
    const { groupId } = useParams() as { groupId: string }
    const { paragraphRef, readMoreRef } = useReadMore()
    const queryClient = useQueryClient()
    const [likeHasToggled, setLikeHasToggled] = useState(false)
    const controls = useAnimation()


    const { mutate: deleteComment, isPending: isDeleting } = useMutation({
        mutationFn: () => api.delete(`/groups/${groupId}/comments/${comment._id}`),
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status < 500) toast.error(err.message)
        },
        onSettled: () => refetchComments()
    })


    const { mutate: toggleLikeOnComment } = useMutation({
        mutationFn: () => api.patch(`/groups/${groupId}/comments/${comment._id}/likes`),
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status < 500) toast.error(err.message)
        }

    })

    const debounceLike = async () => {
        if (!user) return

        setLikeHasToggled(prev => !prev)
        controls.start({
            scale: [.9, 1.1, .95, 1],
            transition: { duration: .3, ease: "easeInOut" }
        })

        queryClient.setQueryData<ApiSuccess<{ comments: Comment[] }>>(['groups', groupId, 'comments'], (queryData) => {
            if (!queryData) return queryData

            const oldLikes = [...comment.likes]
            let newLikes: string[]
            if (comment.likes.includes(user._id)) newLikes = comment.likes.filter(e => e != user._id)
            else {
                oldLikes.push(user._id)
                newLikes = oldLikes
            }
            const newComment: Comment = { ...comment, likes: newLikes }
            const newComments = [...queryData.data.comments]
            newComments[index] = newComment
            return { ...queryData, data: { ...queryData.data, comments: newComments } }
        })
    }

    useEffect(() => {
        if (!likeHasToggled) return
        const debounceTimer = setTimeout(() => {
            toggleLikeOnComment()
            setLikeHasToggled(false) //Resetting toggled state
        }, 500);
        return () => clearTimeout(debounceTimer)
    }, [likeHasToggled, toggleLikeOnComment])


    return (
        <div className={styles.comment}>
            <Avatar avatar={comment.author.avatar} imgSize={400} title={comment.author.fullName} alt='commenter-avatar' className={styles.avatarWrapper} />
            <div className={styles.contentWrapper}>
                <div className={styles.contentHeader}>
                    <span className={styles.username}>{comment?.author.username}</span>
                    <span>{moment.duration(new Date().getTime() - new Date(comment.createdAt).getTime()).humanize()} ago</span>
                    {comment.author._id === user?._id &&
                        <>
                            <button popoverTarget={`comment-options-for-${comment._id}`} className={styles.commentOptionsBtn}><EllipsisVertical size={20} /></button>
                            <div className={styles.commentOptions} popover='auto' id={`comment-options-for-${comment._id}`}>
                                <button popoverTarget={`comment-options-for-${comment._id}`} popoverTargetAction='hide' disabled={isDeleting} onClick={() => deleteComment()} className={styles.commentOption}>
                                    <Trash2 />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </>
                    }

                </div>
                <p ref={paragraphRef} className={styles.content}>
                    {comment.comment}
                </p>
                <input type="checkbox" id={`toggleMoreContent-for-${comment._id}`} style={{ display: 'none' }} />
                <label ref={readMoreRef} role='button' htmlFor={`toggleMoreContent-for-${comment._id}`} className={styles.toggleMoreContent} />
                <div className={styles.interactionsWrapper}>
                    <motion.button animate={controls} onClick={debounceLike} className={styles.likeButton} aria-label='like'>
                        <Heart className={clsx(comment.likes.includes(user?._id ?? '') && styles.liked)} size={16} />
                    </motion.button>
                    {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
                </div>
            </div>
        </div >
    )
}
