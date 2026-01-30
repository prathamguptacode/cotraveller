import { useState } from 'react'
import mystyle from '../FAQS.module.css'
import { IoIosArrowDown } from "react-icons/io";
import clsx from 'clsx';


type Faq = {
    question: string,
    answer: string
}
const faqs: Faq[] = [
    {
        question: "How does this platform work?",
        answer: `CoTraveller helps you find people who are travelling to the same place.
        Just create a travel post or join an existing one, chat inside the group, and plan your trip together — safely and easily.`
    },
    {
        question: "How do I approve travel requests?",
        answer: `Once someone requests to join your group, you’ll see it in the Mail icon on your navbar.
        Open it → review the request → Approve or Reject.
        That’s it — your group is fully under your control.`
    },
    {
        question: "How do I create my own travel group?",
        answer: `Go to the homepage and tap “Create Group” or Plus icon.
                 Add your destination, travel date, how many people you’re looking for, and a short description.
                 Once you post it, others can request to join—and you decide whom to accept.`
    },
    {
        question: "Why did we build this platform?",
        answer: `Because we love code that solves real problems.
                 We noticed so many students wanting travel partners but having no simple way to find them.
                 So our team coded CoTraveller to make that experience safe, fun, and super easy.`
    }
]
function FAQS() {

    const [shownAnswer, setShownAnswer] = useState<string>('')
    const handleToggleAnswer = (id: string) => {
        setShownAnswer(prev => prev === id ? '' : id)
    }


    return (
        <div className={mystyle.wrapper}>
            <div className={mystyle.title}>Frequently asked questions</div>
            {
                faqs.map((faq, i) => {
                    const id = i.toString()
                    return (
                        <FAQ key={id} id={id} faq={faq} handleToggleAnswer={handleToggleAnswer} shownAnswer={shownAnswer} />
                    )
                })
            }

        </div>
    )
}

export default FAQS


type FAQProps = {
    id: string,
    handleToggleAnswer: (id: string) => void,
    faq: Faq,
    shownAnswer: string
}
const FAQ = ({ id, handleToggleAnswer, faq, shownAnswer }: FAQProps) => {
    return (
        <div className={clsx(mystyle.qbox, shownAnswer === id && mystyle.open)}>
            <div className={mystyle.arrowbx}>
                <div className={mystyle.question}>{faq.question}</div>
                <button onClick={() => handleToggleAnswer(id)} aria-label='Show Answer' className={mystyle.arrow}  >
                    <IoIosArrowDown size={20} />
                </button>
            </div>
            <p className={mystyle.ans} >
                {faq.answer}
            </p>
        </div>
    )
}