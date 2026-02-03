import mystyle from '../groupInfo.module.css'
import { FaHeartCrack, FaUser } from 'react-icons/fa6'
import type { Comment, Group } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { normalizeError } from '@/utils/normalizeError'
import { toast } from 'sonner'
import { api } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type CommentsSectionProps = {
    groupId: string | undefined,
    group: Group
}

const CommentsSection = ({ groupId, group }: CommentsSectionProps) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const commentRef = useRef<HTMLInputElement>(null)
    const [comments, setComments] = useState<Comment[]>(group.comments)


    const postCommentMutation = useMutation({
        mutationFn: ({ comment, author }: { comment: string, author: string }) => {
            setComments(prev => [{ comment, author }, ...prev])
            if (commentRef.current) commentRef.current.value = ''
            return api.post<{ comment: Comment }>(`/groups/${groupId}/comments`, { comment })
        },
        onError: (error) => {
            const err = normalizeError(error)
            setComments(prev => {
                if (commentRef.current) commentRef.current.value = prev[0].comment
                return [...prev].slice(1)
            })
            toast.error("An error occurred", {
                description: err.message
            })
        }
    })

    async function postComment() {
        if (!user || !groupId) return navigate('/login')
        if (!commentRef.current?.value) return toast.error("Invalid comment", {
            description: "Comment cannot be empty"
        })
        postCommentMutation.mutate({ comment: commentRef.current.value, author: user._id })
    }

    return (
        <div className={mystyle.commentbx}>
            <div className={mystyle.commentTitle}>Comments:</div>
            <div className={mystyle.input}>
                <div className={mystyle.questionTitle}>
                    <input onKeyDown={(e) => {
                        if (e.key === "Enter") postComment()
                    }} type="text" placeholder='Add a comment' className={mystyle.inbx} ref={commentRef} />
                    <button aria-label='Post Comment' onClick={postComment} className={mystyle.addbtn} >Post</button>
                </div>
            </div>
            {
                comments.length == 0 ? <div className={mystyle.defComment}>
                    <FaHeartCrack size="22px" />
                    No comments yet — be the first to share your thoughts!
                </div> :
                    comments.map((comment) => {
                        return (
                            <div className={mystyle.comments}>
                                <FaUser size="24px" />
                                <div className={mystyle.commentcan}>
                                    <div className={mystyle.userComment}>{comment.author}</div>
                                    <div className={mystyle.conComment}>{comment.comment}</div>
                                </div>
                            </div>
                        )
                    }
                    )
            }
        </div>
    )
}

export default CommentsSection
