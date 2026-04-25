import { toast } from "sonner"
import styles from './popovers.module.css'
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, WhatsappIcon, WhatsappShareButton, XIcon, XShareButton } from 'react-share'
import { X } from "lucide-react"

type ShareMenuPopoverProps = {
    title: string,
    shareURL?: string,
    popoverId?: string
}

const ShareMenuPopover = ({ title, shareURL = new URL(location.pathname, location.origin).href, popoverId = 'shareMenu' }: ShareMenuPopoverProps) => {


    const copyShareLink = () => {
        try {
            navigator.clipboard.writeText(shareURL)
            toast.success("Link copied to clipboard")
        } catch (error) {
            console.warn(error)
            toast.error("An error occurred")
        }
    }


    return (
        <div popover='auto' id={popoverId} className={styles.shareMenu}>
            <header className={styles.shareMenuHeader}>
                Share <button popoverTarget={popoverId} popoverTargetAction='hide'>
                    <X />
                </button>
            </header>
            <div className={styles.shareOptions}>
                <div>
                    <WhatsappShareButton aria-label='share link to Whatsapp' url={shareURL}>
                        <WhatsappIcon />
                    </WhatsappShareButton>
                    Whatsapp
                </div>
                <div>
                    <FacebookShareButton title={title} aria-label='share link to Facebook' url={shareURL}>
                        <FacebookIcon />
                    </FacebookShareButton>
                    Facebook
                </div>
                <div>
                    <XShareButton title={title} aria-label='share link to X' url={shareURL}>
                        <XIcon />
                    </XShareButton>
                    X
                </div>
                <div>
                    <EmailShareButton title={title} aria-label='share link to EmailShareButton' url={shareURL}>
                        <EmailIcon />
                    </EmailShareButton>
                    Email
                </div>
                <div>
                    <RedditShareButton title={title} aria-label='share link to Reddit' url={shareURL}>
                        <RedditIcon />
                    </RedditShareButton>
                    Reddit
                </div>
                <div>
                    <LinkedinShareButton title={title} aria-label='share link to Linkedin' url={shareURL}>
                        <LinkedinIcon />
                    </LinkedinShareButton>
                    Linkedin
                </div>
            </div>
            <div className={styles.copyLinkArea}>
                <input type="text" readOnly value={shareURL} />
                <button onClick={copyShareLink} className={styles.copyLinkButton}>Copy</button>
            </div>
        </div>
    )
}


export default ShareMenuPopover