import React, { useRef, useState } from 'react'
import mystyle from './FeedbackPage.module.css'
import NewNav from '@/components/CreateGroup/newNav'
import { api } from '@/api/axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

function FeedbackPage() {

    const improvement = useRef<HTMLInputElement>(null)
    const bug = useRef<HTMLInputElement>(null)
    const story = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const [btn, setBtn] = useState(0)

    async function handleClick() {
        const improvementData = improvement.current?.value;
        const bugData = bug.current?.value;
        const storyData = story.current?.value;
        const body = {
            suggestion: improvementData,
            bug: bugData,
            story: storyData
        }
        const res = await api.post('/feedback', body)
        if (res.status == 201) {
            toast.success('Your feedback has been successfully submitted', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: '6px 20px'
                }
            })
            setBtn(1)
        }
        else {
            toast.error('Something went wrong', {
                style: {
                    borderRadius: '10px',
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    padding: '6px 20px'
                }
            })
        }
    }

    function handleHome() {
        navigate('/')
    }

    return (
        <div className={mystyle.feedback}>
            <NewNav />
            <div className={mystyle.upperbx}>
                <div className={mystyle.titleTile}>
                    <div className={mystyle.strip}></div>
                    <div className={mystyle.title}>Help Us Make This Better</div>
                    <div className={mystyle.con}>Your feedback helps us improve the experience for every traveller.
                        Share anything—ideas, suggestions, issues, or features you want to see next.</div>
                </div>
            </div>

            <div className={mystyle.inputbx}>
                <div className={mystyle.questionTitle}>
                    <label htmlFor='improvementFeedback' className={mystyle.ques}>What would you like to suggest or improve?</label>
                    <input id='improvementFeedback' type="text" className={mystyle.inbx} ref={improvement} />
                </div>
                <div className={mystyle.questionTitle}>
                    <label htmlFor='bugFeedback' className={mystyle.ques}>Did you face any issues or bugs? If yes, describe them.</label>
                    <input id='bugFeedback' type="text" className={mystyle.inbx} ref={bug} />
                </div>
                <div className={mystyle.questionTitle}>
                    <label htmlFor='storyFeedback' className={mystyle.ques}>Any story of yours with this website which you want to share with us</label>
                    <input id='storyFeedback' type="text" className={mystyle.inbx} ref={story} />
                </div>
            </div>

            <div className={mystyle.btnbox}>
                {
                    btn ? <button aria-label='Return Home' className={mystyle.mysubmit} onClick={handleHome}>Return Home</button> : <button aria-label='Submit' onClick={handleClick} className={mystyle.mysubmit}>Submit</button>
                }
            </div>
            
        </div>
    )
}

export default FeedbackPage
