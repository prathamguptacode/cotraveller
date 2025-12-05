import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { callAuthApi } from '../../../api/axios'

const Outbox = () => {
    const [groups, setGroups] = useState([])
    const [changed, setChanged] = useState(false)

    useEffect(() => {
            (async () => {
                const { status, data } = await callAuthApi('get', '/user/outbox')
                if (status === 200) setGroups(data.data.groups)
                else console.error(data.message)
            })()

    }, [changed])

    const deleteOutgoingRequest = async (requestId) => {
        const { status, data } = await callAuthApi('delete', `/user/requests/${requestId}`)
        if (status === 204) setChanged(prev => !prev)
        else console.error(data.message)
    }

    return (
        <div className={styles.list}>
            {
                groups.map(group => {
                    return (<Link key={group._id} className={styles.listItem}>
                        <div className={styles.avatarWrapper} >
                            <img src="apple-light.svg" alt="avatar" />
                        </div>
                        <div className={styles.detailsWrapper}>
                            <p className={styles.groupName}>{group.title}</p>
                            <p className={styles.lastMessage}>Members: {group.memberNumber} </p>
                        </div>
                        <div className={styles.choicesWrapper}>
                            <button onClick={() => deleteOutgoingRequest(group._id)}> <X color='#EE2D3E' /></button>
                        </div>
                    </Link>)
                })
            }


        </div>
    )
}

export default Outbox
