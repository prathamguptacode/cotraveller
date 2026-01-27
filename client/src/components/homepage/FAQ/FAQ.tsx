import React, { useRef, useState } from 'react'
import mystyle from './FAQ.module.css'
import { IoIosArrowDown } from "react-icons/io";

function FAQ() {

    const sp1 = useRef<HTMLDivElement>(null)
    const arrow1 = useRef<HTMLButtonElement>(null)
    const [open1, setOpen1] = useState(0)

    function handleClick1() {
        const sp1current = sp1.current;
        if (!sp1current) return;
        if (!open1) {

            sp1current.style.margin = "16px 0"
            sp1current.style.height = sp1current.scrollHeight + "px";
            setOpen1(1)
            if (arrow1.current) arrow1.current.style.transform = "rotate(180deg)"
        }
        else {
            sp1current.style.height = "0px";
            sp1current.style.margin = "0"
            setOpen1(0)
            if (arrow1.current) arrow1.current.style.transform = "rotate(0deg)"
        }
    }


    const ans2 = useRef<HTMLDivElement>(null)
    const arrow2 = useRef<HTMLButtonElement>(null)
    const [open2, setOpen2] = useState(0)

    function handleClick2() {
        const ans2current = ans2.current;
        if (!ans2current) return;
        if (!open2) {
            ans2current.style.margin = "16px 0"
            ans2current.style.height = ans2current.scrollHeight + "px";
            setOpen2(1)
            if (arrow2.current) arrow2.current.style.transform = "rotate(180deg)"
        }
        else {
            ans2current.style.height = "0px";
            ans2current.style.margin = "0"
            setOpen2(0)
            if (arrow2.current) arrow2.current.style.transform = "rotate(0deg)"
        }
    }

    const ans3 = useRef<HTMLDivElement>(null)
    const arrow3 = useRef<HTMLButtonElement>(null)
    const [open3, setOpen3] = useState(0)

    function handleClick3() {
        const ans3current = ans3.current;
        if (!ans3current) return;
        if (!open3) {
            ans3current.style.margin = "16px 0"
            ans3current.style.height = ans3current.scrollHeight + "px";
            setOpen3(1)
            if (arrow3.current) arrow3.current.style.transform = "rotate(180deg)"
        }
        else {
            ans3current.style.height = "0px";
            ans3current.style.margin = "0"
            setOpen3(0)
            if (arrow3.current) arrow3.current.style.transform = "rotate(0deg)"
        }
    }

    const ans4 = useRef<HTMLDivElement>(null)
    const arrow4 = useRef<HTMLButtonElement>(null)
    const [open4, setOpen4] = useState(0)

    function handleClick4() {
        const ans4current = ans4.current;
        if (!ans4current) return;
        if (!open4) {
            ans4current.style.margin = "16px 0"
            ans4current.style.height = ans4current.scrollHeight + "px";
            setOpen4(1)
            if (arrow4.current) arrow4.current.style.transform = "rotate(180deg)"
        }
        else {
            ans4current.style.height = "0px";
            ans4current.style.margin = "0"
            setOpen4(0)
            if (arrow4.current) arrow4.current.style.transform = "rotate(0deg)"
        }
    }



    return (
        <div className={mystyle.wrapper}>
            <div className={mystyle.title}>Frequently asked questions</div>

            <div className={mystyle.qbox}>

                <div className={mystyle.arrowbx}>
                    <div className={mystyle.question}>How does this platform work?</div>
                    <button aria-label='Show Answer' className={mystyle.arrow} onClick={handleClick1} ref={arrow1} >
                        < IoIosArrowDown size={20} />
                    </button>
                </div>
                <div className={mystyle.ans} ref={sp1}>CoTraveller helps you find people who are travelling to the same place. <br />
                    Just create a travel post or join an existing one, chat inside the group, and plan your trip together — safely and easily.
                </div>
            </div>


            <div className={mystyle.qbox}>
                <div className={mystyle.arrowbx}>
                    <div className={mystyle.question}>How do I approve travel requests?</div>
                    <button aria-label='Show Answer' className={mystyle.arrow} onClick={handleClick2} ref={arrow2} >
                        < IoIosArrowDown size={20} />
                    </button>
                </div>
                <div className={mystyle.ans} ref={ans2}>Once someone requests to join your group, you’ll see it in the Mail icon on your navbar.<br />
                    Open it → review the request → Approve or Reject.
                    <br />
                    That’s it — your group is fully under your control.
                </div>
            </div>

            <div className={mystyle.qbox}>
                <div className={mystyle.arrowbx}>
                    <div className={mystyle.question}>How do I create my own travel group?</div>
                    <button aria-label='Show Answer' className={mystyle.arrow} onClick={handleClick3} ref={arrow3} >
                        < IoIosArrowDown size={20} />
                    </button>
                </div>
                <div className={mystyle.ans} ref={ans3}>Go to the homepage and tap “Create Group” or Plus icon.
                    <br />
                    Add your destination, travel date, how many people you’re looking for, and a short description.
                    <br />
                    Once you post it, others can request to join—and you decide whom to accept.
                </div>
            </div>


            <div className={mystyle.qbox}>
                <div className={mystyle.arrowbx}>
                    <div className={mystyle.question}>Why did we build this platform?</div>
                    <button aria-label='Show Answer' className={mystyle.arrow} onClick={handleClick4} ref={arrow4} >
                        < IoIosArrowDown size={20} />
                    </button>
                </div>
                <div className={mystyle.ans} ref={ans4}>Because we love code that solves real problems.
                    <br />
                    We noticed so many students wanting travel partners but having no simple way to find them.
                    <br />
                    So our team coded CoTraveller to make that experience safe, fun, and super easy.
                </div>
            </div>
        </div>
    )
}

export default FAQ
