import React from 'react'
import styles from './chats.module.css'
import { Mail, MessagesSquare, SendHorizontal, Cog, LogOut, HelpCircle, ChevronsLeft, Ellipsis, Smile, CheckCheck } from 'lucide-react'
import clsx from 'clsx'
import Groups from '../../../components/homepage/Sidebar/Groups'
import Inbox from '../../../components/homepage/Sidebar/Inbox'
import Outbox from '../../../components/homepage/Sidebar/Outbox'





const Chats = () => {

    

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidebarWrapper}>

                <div className={styles.list}>
                    <button className={styles.listItem}>
                        <MessagesSquare size={28} />
                        <ToolTip text={'Chats'} />
                    </button>
                    <button className={styles.listItem}>
                        <Mail size={26} />
                        <ToolTip text={'Inbox'} />

                    </button>
                    <button className={styles.listItem}>
                        <SendHorizontal size={26} />
                        <ToolTip text={'Sent'} />
                    </button>
                </div>

                <div className={clsx(styles.list, styles.footerList)}>
                    <button className={styles.listItem}>
                        <Cog size={28} />
                        <ToolTip text={'Settings'} />
                    </button>
                    <button className={styles.listItem}>
                        <HelpCircle size={26} />
                        <ToolTip text={'Help'} />
                    </button>
                    <button className={styles.listItem}>
                        <LogOut size={26} />
                        <ToolTip text={'Logout'} />
                    </button>
                </div>

            </div>

            <div className={styles.sidebarExpansionWrapper}>

                <div className={styles.expansionHeader}>
                    <h2>Chats</h2>
                    <button className={styles.listItem}>
                        <ChevronsLeft size={28} strokeWidth={1.4} />
                        <ToolTip text={'Hide'} />
                    </button>
                </div>

                {/* <div className={styles.searchAreaWrapper}>
               // ###ADD LATER if needed , maybe to search for something, idk
                </div> */}

                <Groups />
                {/* <Inbox /> */}
                {/* <Outbox /> */}
            </div>



            <div className={styles.chatAreaWrapper}>
                <div className={styles.chatAreaHeader}>

                    <div className={styles.avatarWrapper}>
                        <img src="/apple-light.svg" alt="avatar" />
                    </div>

                    {/* ###LATER add feature to go view group details by pressing on groupDetails contents */}
                    <div className={styles.groupDetails}>
                        <h3>
                            The HitchHikers
                        </h3>
                        <p>Anushka Somvanshi, Pratham Gupta, Shubham Panjiyara</p>
                    </div>

                    <button className={clsx(styles.groupOptions, styles.listItem)}>
                        <Ellipsis />
                    </button>

                </div>

                <div className={styles.messages}>

                    <div className={styles.message}>
                        <div className={styles.messageAuthor}>
                            Anushka Somvanshi
                        </div>
                        <div className={styles.messageDetails}>
                            <div className={styles.messageText}>
                                Oye! Shubhu, jaldi chalo
                            </div>
                            <div className={styles.messageTime}>
                                5:40 AM
                            </div>
                            <div className={styles.messageSeenState}>
                                <CheckCheck size={18} />
                            </div>
                        </div>
                    </div>
                  
                    <div className={clsx(styles.message, styles.myMessage)}>
                        <div className={styles.messageAuthor}>
                            Shubham Panjiyara
                        </div>
                        <div className={styles.messageDetails}>
                            <div className={styles.messageText}>
                                Bas, aaya, Pratham kidhar hai?
                            </div>
                            <div className={styles.messageTime}>
                                5:40 AM
                            </div>
                            <div className={styles.messageSeenState}>
                                <CheckCheck color='#09eb42ff' size={18} />
                            </div>
                        </div>
                    </div>
                      <div className={styles.message}>
                        <div className={styles.messageAuthor}>
                            Pratham Gupta
                        </div>
                        <div className={styles.messageDetails}>
                            <div className={styles.messageText}>
                                Main to kab ka aa gaya
                            </div>
                            <div className={styles.messageTime}>
                                5:40 AM
                            </div>
                            <div className={styles.messageSeenState}>
                                <CheckCheck size={18} />
                            </div>
                        </div>
                    </div>

                </div>



                <div className={styles.inputAreaWrapper}>
                    <div className={styles.inputWrapper}>
                        <input type="text" />
                        <button>
                            <Smile size={20} />
                        </button>

                    </div>
                </div>

            </div>


        </div>
    )
}

export default Chats

export const ToolTip = ({ text, className }) => {
    return (
        <span className={clsx(styles.listItemTooltip, styles[className])}>
            {text}
        </span>
    )
}